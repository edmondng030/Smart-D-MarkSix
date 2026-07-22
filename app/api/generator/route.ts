import{enforceRateLimit}from"@/lib/security/rate-limit";
import { apiError,apiSuccess } from "@/lib/api/response";
import { loadAnalyticsDraws } from "@/lib/analytics/repository";
import { generateCombinations,GeneratorConstraintError } from "@/lib/generator/engine";
import { generatorRequestSchema } from "@/lib/generator/schema";
import { calculateNumberFrequency } from "@/lib/statistics/draw-analytics";
import { createClient } from "@/lib/supabase/server";

export async function POST(request:Request){const limited=await enforceRateLimit(request,{scope:"generator",limit:20,windowSeconds:60});if(limited)return limited;
  const parsed=generatorRequestSchema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return apiError("VALIDATION_ERROR","Invalid generator request.",400,parsed.error.flatten());
  try{
    const draws=await loadAnalyticsDraws({window:"all",includeExtra:false}),latest=draws[0]?.mainNumbers??[],frequencies=calculateNumberFrequency(draws),started=performance.now();
    const result=generateCombinations({...parsed.data,previousDraw:latest,frequencies}),executionMs=Math.round(performance.now()-started);
    let runId:string|null=null;
    const supabase=await createClient(),{data:{user}}=await supabase.auth.getUser();
    if(user){
      const{data:run}=await supabase.from("generation_runs").insert({user_id:user.id,method:parsed.data.method,model_version:"generator-v1",random_seed:parsed.data.seed,parameters:parsed.data.constraints,generated_count:result.combinations.length,execution_ms:executionMs}).select("id").single();
      if(run){runId=run.id;await supabase.from("generated_combinations").insert(result.combinations.map((combination,index)=>({run_id:run.id,numbers:combination.numbers,historical_score:combination.historicalScore,explanation:combination.explanation,rank_in_run:index+1})));}
    }
    return apiSuccess({runId,method:parsed.data.method,seed:parsed.data.seed,constraints:parsed.data.constraints,modelVersion:"generator-v1",drawCount:draws.length,executionMs,attempts:result.attempts,combinations:result.combinations});
  }catch(error){if(error instanceof GeneratorConstraintError)return apiError("CONSTRAINTS_TOO_STRICT",error.message,422);return apiError("INTERNAL_ERROR","Unable to generate combinations.",500);}
}