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
  total: SrsStageCounts;
  radical: SrsStageCounts;
  kanji: SrsStageCounts;
  vocabulary: SrsStageCounts;
}

export type SrsStageCounts = number[];
