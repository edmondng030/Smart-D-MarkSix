import { describe, expect, it } from "vitest";
import type { AnalyticsDraw } from "@/features/analytics/types";
import { calculateAverageGap, calculateDeviationFromExpected, calculateDrawsSinceLastSeen, calculateExpectedFrequency, calculateNumberFrequency, calculateNumberStatistics, calculatePairCounts, calculatePatternFeatures, calculatePatternStatistics } from "@/lib/statistics/draw-analytics";

const draws:AnalyticsDraw[]=[
  {drawNumber:"1",drawDate:"2026-01-01",mainNumbers:[1,2,3,10,20,30],extraNumber:40},
  {drawNumber:"2",drawDate:"2026-01-03",mainNumbers:[1,4,11,21,31,41],extraNumber:2},
  {drawNumber:"3",drawDate:"2026-01-05",mainNumbers:[2,4,12,22,32,42],extraNumber:1}
];
describe("draw analytics",()=>{
  it("calculates main and extra frequencies",()=>{expect(calculateNumberFrequency(draws)[1]).toBe(2);expect(calculateNumberFrequency(draws,true)[1]).toBe(3);});
  it("calculates recency and average gaps without looking forward",()=>{expect(calculateDrawsSinceLastSeen(draws)[1]).toBe(1);expect(calculateDrawsSinceLastSeen(draws)[2]).toBe(0);expect(calculateAverageGap(draws)[1]).toBe(1);expect(calculateAverageGap(draws)[2]).toBe(2);});
  it("calculates expected frequency and deviation",()=>{expect(calculateExpectedFrequency(49)).toBe(6);expect(calculateDeviationFromExpected(9,6)).toBe(.5);expect(calculateNumberStatistics(draws)).toHaveLength(49);});
  it("extracts pattern and aggregate features",()=>{expect(calculatePatternFeatures(draws[0])).toMatchObject({sum:66,odd:2,even:4,low:5,high:1,hasConsecutive:true});const result=calculatePatternStatistics(draws);expect(result.drawCount).toBe(3);expect(result.consecutiveDraws).toBe(1);expect(result.minimumSum).toBe(66);});
  it("counts each main-number pair once per draw",()=>{const pairs=calculatePairCounts(draws);expect(pairs.find((pair)=>pair.numbers[0]===1&&pair.numbers[1]===2)?.count).toBe(1);expect(pairs.find((pair)=>pair.numbers[0]===2&&pair.numbers[1]===4)?.count).toBe(1);expect(pairs).toHaveLength(45);});
});
