export type PrizeDivision=1|2|3|4|5|6|7|null;
export type CheckResult={drawNumber:string;drawDate:string;selectedNumbers:number[];mainMatches:number[];extraMatch:number|null;mainHitCount:number;hasExtraHit:boolean;prizeDivision:PrizeDivision;prizeLabel:string;dividend:number|null};
