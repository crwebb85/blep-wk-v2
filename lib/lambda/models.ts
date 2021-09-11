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

export type Metric = {
  updatedAt: Date;
  availableReviewCount?: number;
  currentLevel?: number;
  hoursIn: number;
  srsLevels: number;
  username: string;
};
