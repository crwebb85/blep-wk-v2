// Service Layer
export interface ErrorResponse {
  error: string;
  message: string;
}

export interface GetMetricsRequest {
  wkApiKeys: string[];
}

export interface GetMetricsResponse {
  metrics: Metric[];
}

//Business Layer

export interface Metric {
  updatedAt: Date;
  availableReviewCount?: number;
  currentLevel?: number;
  hoursIn: number;
  srsLevels: SRSAggregate;
  username: string;
}

type NumberOfSRSStages = 10;

export interface SRSAggregate {
  total: SRSStageCounts<NumberOfSRSStages>;
  radical: SRSStageCounts<NumberOfSRSStages>;
  kanji: SRSStageCounts<NumberOfSRSStages>;
  vocabulary: SRSStageCounts<NumberOfSRSStages>;
}

export interface SRSStageCounts<L extends number> extends Array<number> {
  0: number;
  length: L;
}
