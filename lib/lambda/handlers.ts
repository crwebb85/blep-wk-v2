import * as service from '@lambda/core';
import * as validators from '@lambda/validators';

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

import { GetMetricsResponse } from '@lambda/models';

/**
 * The handler for fetching the metrics for the list of WaniKani API keys.
 * @param event
 * @returns The APIGatewayProxyEventV2 with the list of metrics
 */
export async function getMetricsHandler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const request = validators.validateGetMetricsHandlerRequest(event);

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
  };
}
