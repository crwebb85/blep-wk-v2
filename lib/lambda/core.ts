import * as repository from '@lambda/repository';

import { GetMetricsRequest, Metric } from './models';

import { MetricEntity } from './entities';

/**
 * Intended to get the metrics for each of the Wani Kani API keys.
 * Side Effect: Persists unknown API keys so that another lambda can start tracking metrics for the user.
 * @param request.wkApiKeys the list of Wani Kani API keys.
 * @returns the latest metrics for the list of API keys.
 */
export async function getMetrics(request: GetMetricsRequest): Promise<Metric[]> {
  const apiKeys = request.wkApiKeys;
  const metricPromises = apiKeys.map(fetchMetric);

  return await Promise.all(metricPromises);
}

/**
 * Fetches the metric for the wkApiKey.
 * @param wkApiKey
 * @returns
 */
async function fetchMetric(wkApiKey: string) {
  const userID = await repository.getUserID(wkApiKey);
  if (!userID) {
    await repository.addApiKey(wkApiKey);
    return {
      wkApiKey: wkApiKey,
    };
  }
  const metricEntity = await fetchTodaysLatestMetricEntity(userID);
  if (!metricEntity) {
    return {
      wkApiKey: wkApiKey,
      username: userID,
    };
  }
  return convertMetricEntityToMetric(metricEntity, wkApiKey);
}

/**
 * Fetches current day's latest `MetricEntity` for the user.
 * @param userID of the user
 * @returns the current day's latest `MetricEntity` for the user.
 */
async function fetchTodaysLatestMetricEntity(userID: string): Promise<MetricEntity | undefined> {
  const metricEntities = await repository.getMetrics(userID, new Date(), undefined);
  return metricEntities.pop();
}

/**
 * Converts a `MetricEntity` to type `Metric`
 * @param metricEntity that needs to be converted to the form the front-end will use
 * @param wkApiKey that was used to lookup the metricEntity
 * @returns the metric in the form the front-end expects.
 */
function convertMetricEntityToMetric(metricEntity: MetricEntity, wkApiKey: string): Metric {
  return {
    wkApiKey: wkApiKey,
    username: metricEntity.username,
    updatedAt: metricEntity.updatedAt,
    availableReviewCount: metricEntity.availableReviewCount,
    currentLevel: metricEntity.currentLevel,
    hoursIn: metricEntity.hoursIn,
    srsLevels: {
      total: metricEntity.srsLevels.total,
      radical: metricEntity.srsLevels.radical,
      kanji: metricEntity.srsLevels.kanji,
      vocabulary: metricEntity.srsLevels.vocabulary,
    },
  };
}
