export type MetricEntity = {
  updatedAt: UnixTimestamp;
  availableReviewCount?: number;
  currentLevel?: number;
  hoursIn: number;
  srsLevels: ItemAggregateEntity;
  username: string;
};

export type UnixTimestamp = number;

type SrsStageCount = 10;

export interface ItemAggregateEntity {
  total: SrsStageCountsEntity<SrsStageCount>;
  radical: SrsStageCountsEntity<SrsStageCount>;
  kanji: SrsStageCountsEntity<SrsStageCount>;
  vocabulary: SrsStageCountsEntity<SrsStageCount>;
}

export interface SrsStageCountsEntity<L extends number> extends Array<number> {
  length: L;
}
