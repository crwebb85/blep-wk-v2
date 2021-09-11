import { ClientError } from '@lambda/errors';
import * as handlers from '@lambda/handlers';
import { ErrorResponse } from '@lambda/models';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda';

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
    } else if (err instanceof Error) {
      throw new Error('Internal service error: ' + err.stack);
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
  return {
    statusCode: clientError.httpStatusCode,
    body: JSON.stringify({
      error: clientError.name,
      message: clientError.message,
    } as ErrorResponse),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
  };
}
