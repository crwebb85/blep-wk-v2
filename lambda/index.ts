import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { Metric } from './model/Metric';
import * as repository from './repository';

exports.handler = async function (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {
  try {
    switch (event.routeKey) {
      case 'GET /metrics':
        return await getMetricsHandler(event);
      default:
        throw new Error(`Unknown route: ${event.routeKey}`);
    }
  } catch (err) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: 'Oops something went wrong.',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
    } as APIGatewayProxyResultV2;
  }
};

/**
 * The handler for fetching the metrics for the list of WaniKani api keys.
 * @param event
 * @returns The APIGatewayProxyEventV2 with the list of metrics
 */
async function getMetricsHandler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  if (!event.pathParameters || !event.pathParameters['users']) {
    throw new Error('Users are missing.');
  }
  const apiKeysStr = event.pathParameters['users'];

  const apiKeys = apiKeysStr.split(',');

  const metricPromises = apiKeys.map(async (apiKey) => {
    const userID = await repository.getUserID(apiKey);
    if (!userID) {
      await repository.addApiKey(apiKey);
      return undefined;
    }
    return await fetchLatestMetric(userID);
  });

  let metrics = await Promise.all(metricPromises);
  metrics = metrics.filter((x) => x); // filter out undefined values
  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify(metrics),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
  } as APIGatewayProxyResultV2;
}

/**
 * Fetches the latest metric recorded for the user.
 * @param userID of the user
 * @returns the latest metric recorded for the user.
 */
async function fetchLatestMetric(userID: string): Promise<Metric | undefined> {
  const metricEntities = await repository.getMetrics(userID, new Date(), undefined);
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
