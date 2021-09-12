import * as service from '@lambda/core';
import { GetMetricsRequest, GetMetricsResponse } from '@lambda/models';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
/**
 * The handler for fetching the metrics for the list of WaniKani API keys.
 * @param event
 * @returns The APIGatewayProxyEventV2 with the list of metrics
 */
export async function getMetricsHandler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const request = validateGetMetricsHandlerRequest(event);

  const metrics = await service.getMetrics(request);

  const response: GetMetricsResponse = {
    metrics: metrics,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
  } as APIGatewayProxyResultV2;
}

/**
 * Validates and parses the request parameters.
 * @param event
 * @returns the API keys from the request parameters
 */
function validateGetMetricsHandlerRequest(event: APIGatewayProxyEventV2): GetMetricsRequest {
  if (!event.pathParameters || !event.pathParameters['users']) {
    throw new Error('Users are missing.');
  }
  const apiKeysStr = event.pathParameters['users'];

  const apiKeys = apiKeysStr.split(',');

  return {
    wkApiKeys: apiKeys,
  };
}
