import{describe,expect,it}from"vitest";
import{checkCombination,classifyPrize,prizeLabel}from"@/lib/checker/prize";
describe("Mark Six prize classification",()=>{
  it.each([[6,false,1],[6,true,1],[5,true,2],[5,false,3],[4,true,4],[4,false,5],[3,true,6],[3,false,7],[2,true,null],[0,false,null]] as const)("classifies %i main hits and extra=%s",(hits,extra,division)=>{expect(classifyPrize(hits,extra)).toBe(division);});
  it("identifies main and extra matches independently",()=>{expect(checkCombination([1,2,3,4,5,9],[1,2,3,4,5,6],9)).toEqual({mainMatches:[1,2,3,4,5],extraMatch:9,mainHitCount:5,hasExtraHit:true,prizeDivision:2,prizeLabel:"二獎"});});
  it("labels a non-winning combination clearly",()=>{expect(prizeLabel(null)).toBe("未達獎項");});
});
