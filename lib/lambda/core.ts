import * as repository from '@lambda/repository';
import { GetMetricsRequest, Metric } from './models';

/**
 * Intended to get the metrics for each of the Wani Kani API keys.
 * Side Effect: Persists unknown API keys so that another lambda can start tracking metrics for the user.
 * @param request.wkApiKeys the list of Wani Kani API keys.
 * @returns the latest metrics for the list of API keys.
 */
export async function getMetrics(request: GetMetricsRequest): Promise<Metric[]> {
  const apiKeys = request.wkApiKeys;
  const metricPromises = apiKeys.map(async (apiKey) => {
    const userID = await repository.getUserID(apiKey);
    if (!userID) {
      await repository.addApiKey(apiKey);
      return undefined;
    }
    return await fetchLatestMetric(userID);
  });

  const unfilteredMetrics = await Promise.all(metricPromises);
  const metrics = unfilteredMetrics.flatMap((f) => (f ? [f] : [])); // filter out undefined values in typesafe way
  return metrics;
}

/**
 * Fetches the latest metric recorded for the user.
 * @param userID of the user
 * @returns the latest metric recorded for the user.
 */
async function fetchLatestMetric(userID: string): Promise<Metric | undefined> {
  const metricEntities = await repository.getMetrics(userID, new Date(), undefined);
  if (!metricEntities.length) {
    return undefined;
  }
  const metricEntity = metricEntities[0];
  return {
    updatedAt: metricEntity.updatedAt,
    availableReviewCount: metricEntity.availableReviewCount,
    currentLevel: metricEntity.currentLevel,
    hoursIn: metricEntity.hoursIn,
    srsLevels: metricEntity.srsLevels,
    username: metricEntity.username,
  } as Metric;
}
