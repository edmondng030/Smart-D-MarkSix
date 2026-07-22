import{z}from"zod";
export const checkerRequestSchema=z.object({drawNumber:z.string().trim().min(1).max(30).regex(/^[\p{L}\p{N}/_-]+$/u),numbers:z.array(z.coerce.number().int().min(1).max(49)).length(6)}).superRefine((value,context)=>{if(new Set(value.numbers).size!==6)context.addIssue({code:"custom",path:["numbers"],message:"Select six unique numbers."});});
