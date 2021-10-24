export type MetricEntity = {
  updatedAt: UnixTimestamp;
  availableReviewCount?: number;
  currentLevel?: number;
  hoursIn: number;
  srsLevels: ItemAggregateEntity;
  username: string;
};

export type UnixTimestamp = number;

export interface ItemAggregateEntity {
  total: SrsStageCountsEntity;
  radical: SrsStageCountsEntity;
  kanji: SrsStageCountsEntity;
  vocabulary: SrsStageCountsEntity;
}

export type SrsStageCountsEntity = number[];
