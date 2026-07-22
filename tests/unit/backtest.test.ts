import{describe,expect,it}from"vitest";
import type{BacktestDraw}from"@/features/backtest/types";
import{runWalkForwardBacktest}from"@/lib/backtest/engine";
const draws:BacktestDraw[]=Array.from({length:80},(_,index)=>{const date=new Date(Date.UTC(2025,0,1+index)).toISOString().slice(0,10),start=index%43+1;return{drawNumber:`D${index+1}`,drawDate:date,mainNumbers:Array.from({length:6},(_,offset)=>((start+offset-1)%49)+1).sort((a,b)=>a-b),extraNumber:((start+10-1)%49)+1,firstPrizeDividend:8000000};});
const request={draws,method:"historical_weighted" as const,targetDrawCount:20,minimumTrainingDraws:30,combinationsPerDraw:3,baseSeed:"audit-seed",seedCount:2,unitCost:10};
describe("walk-forward backtest",()=>{
  it("is reproducible for identical data and seed",()=>{const first=runWalkForwardBacktest(request),second=runWalkForwardBacktest(request);expect(first.strategy).toEqual(second.strategy);expect(first.baseline).toEqual(second.baseline);expect(first.targets).toEqual(second.targets);});
  it("never trains on or after the target draw",()=>{const result=runWalkForwardBacktest(request);expect(result.trainingEndBeforeEveryTarget).toBe(true);for(const target of result.targets)expect(target.trainingEndDate<target.drawDate).toBe(true);expect(result.targets[0].trainingDrawCount).toBe(60);expect(result.targets.at(-1)?.trainingDrawCount).toBe(79);});
  it("uses matching sample sizes for strategy and baseline",()=>{const result=runWalkForwardBacktest(request),expected=20*3*2;expect(result.strategy.predictions).toBe(expected);expect(result.baseline.predictions).toBe(expected);expect(Object.values(result.strategy.hitDistribution).reduce((a,b)=>a+b,0)).toBe(expected);});
  it("calculates transparent cost and bounded target counts",()=>{const result=runWalkForwardBacktest({...request,targetDrawCount:500});expect(result.targetDraws).toBe(50);expect(result.strategy.simulatedCost).toBe(50*3*2*10);});
  it("rejects insufficient training history",()=>{expect(()=>runWalkForwardBacktest({...request,minimumTrainingDraws:80})).toThrow("INSUFFICIENT_TRAINING_DATA");});
});
