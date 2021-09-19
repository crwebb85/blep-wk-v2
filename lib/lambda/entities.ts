export type MetricEntity = {
  updatedAt: Date;
  availableReviewCount?: number;
  currentLevel?: number;
  hoursIn: number;
  srsLevels: SRSAggregateEntity;
  username: string;
};

type NumberOfSRSStages = 10;

export interface SRSAggregateEntity {
  total: SRSStageCountsEntity<NumberOfSRSStages>;
  radical: SRSStageCountsEntity<NumberOfSRSStages>;
  kanji: SRSStageCountsEntity<NumberOfSRSStages>;
  vocabulary: SRSStageCountsEntity<NumberOfSRSStages>;
}

export interface SRSStageCountsEntity<L extends number> extends Array<number> {
  0: number;
  length: L;
}
