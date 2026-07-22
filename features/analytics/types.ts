export type AnalyticsDraw = { drawNumber: string; drawDate: string; mainNumbers: number[]; extraNumber: number };
export type NumberStatistic = { number: number; frequency: number; expectedFrequency: number; deviationFromExpected: number; drawsSinceLastSeen: number | null; averageGap: number | null };
export type PatternStatistics = { drawCount: number; averageSum: number; minimumSum: number; maximumSum: number; oddEven: Array<{ odd: number; even: number; count: number }>; lowHigh: Array<{ low: number; high: number; count: number }>; consecutiveDraws: number; consecutiveRate: number };
export type PairStatistic = { numbers: [number, number]; count: number; rate: number };
