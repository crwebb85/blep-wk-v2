import * as handlers from '@lambda/handlers';

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda';

import { ClientError } from '@lambda/errors';
import { ErrorResponse } from '@lambda/models';

/**
 * The entry point for the API.
 * @param event
 * @param context
 * @returns The API Gateway response for the proxied API call.
 */
export async function handler(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {
  try {
    switch (event.routeKey) {
      case 'GET /metrics':
        return await handlers.getMetricsHandler(event);
      default:
        throw new Error(`Unknown route: ${event.routeKey}`);
    }
  } catch (err) {
    if (err instanceof ClientError) {
      return prepareClientErrorResponse(err);
    } else if (err instanceof Error && err.stack) {
      throw new Error('Internal service error: ' + err.stack.toString());
    } else {
      throw new Error('Internal service error.');
    }
  }
}

/**
 * Converts the client error into a response suitable for the client.
 * @param clientError
 * @returns The API Gateway response for the error that will be exposed to the client.
 */
function prepareClientErrorResponse(clientError: ClientError): APIGatewayProxyResultV2 | PromiseLike<APIGatewayProxyResultV2> {
  const errorResponse: ErrorResponse = {
    error: clientError.name,
    message: clientError.message,
  };
  return {
    statusCode: clientError.httpStatusCode,
    body: JSON.stringify(errorResponse),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
  };
}
