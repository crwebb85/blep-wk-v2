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

interface MetricUnknown {
  wkApiKey: string;
  username?: string;
}

interface MetricRecord {
  wkApiKey: string;
  username: string;
  updatedAt: UnixTimestamp;
  availableReviewCount?: number;
  currentLevel?: number;
  hoursIn: number;
  srsLevels: ItemAggregate;
}

export type UnixTimestamp = number;

export type Metric = MetricRecord | MetricUnknown;

export interface ItemAggregate {
  total: SrsStageCounts<SrsStageCount>;
  radical: SrsStageCounts<SrsStageCount>;
  kanji: SrsStageCounts<SrsStageCount>;
  vocabulary: SrsStageCounts<SrsStageCount>;
}

type SrsStageCount = 10;
export class SrsStageCounts<L extends number> extends Array<number> {
  length: L;
}
