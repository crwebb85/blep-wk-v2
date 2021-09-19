import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidationError } from './errors';
import { GetMetricsRequest } from './models';

/**
 * Validates and parses the request parameters.
 * @param event
 * @throws {@ link ValidationError} - Thrown when the request parameters does not list any users.
 * @returns the API keys from the request parameters
 */
export function validateGetMetricsHandlerRequest(event: APIGatewayProxyEventV2): GetMetricsRequest {
  if (!event.pathParameters || !event.pathParameters['users']) {
    throw new ValidationError('Users are missing.');
  }
  const apiKeysStr = event.pathParameters['users'];

  const apiKeys = apiKeysStr.split(',');

  return {
    wkApiKeys: apiKeys,
  };
}
