export type GenerationMethod="uniform_random"|"conditional_random"|"historical_weighted";
export type GeneratorConstraints={required:number[];excluded:number[];oddCount?:number;lowCount?:number;minSum?:number;maxSum?:number;allowConsecutive:boolean;maxSameEndingDigit?:number;excludePreviousDraw:boolean};
export type GeneratedCombination={numbers:number[];historicalScore:number|null;explanation:string[]};
