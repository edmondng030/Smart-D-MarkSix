export type DrawSummary = {
  drawNumber: string;
  drawDate: string;
  mainNumbers: number[];
  extraNumber: number;
  turnover: number | null;
  firstPrizeFund: number | null;
  firstPrizeDividend: number | null;
  sourceName: string | null;
  sourceRetrievedAt?: string | null;
};

export type DrawDetail = DrawSummary & {
  sourceUrl: string | null;
  sourceRetrievedAt: string | null;
  prizes: Array<{ division: number; winningUnits: number | null; dividend: number | null }>;
};
