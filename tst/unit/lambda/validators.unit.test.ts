import { APIGatewayProxyEventV2, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { ValidationError } from '@lambda/errors';
import { GetMetricsRequest } from '@lambda/models';
import { validateGetMetricsHandlerRequest } from '@lambda/validators';

test('Path parameters should be parsed into a GetMetricsRequest', () => {
  const apiKey1 = '63bc8245-eefc-46f0-a82d-9452df542182';
  const apiKey2 = '0d99a940-1eee-4147-9cfe-f0f2aca6801b';
  const pathParameters = { users: `${apiKey1},${apiKey2}` } as APIGatewayProxyEventPathParameters;
  const event = { pathParameters: pathParameters } as APIGatewayProxyEventV2;

  const expectedGetMetricsRequest = {
    wkApiKeys: [apiKey1, apiKey2],
  } as GetMetricsRequest;

  expect(validateGetMetricsHandlerRequest(event)).toStrictEqual(expectedGetMetricsRequest);
});

test('Must throw ValidationError if the parameter ```users``` is empty', () => {
  const pathParameters = { users: '' } as APIGatewayProxyEventPathParameters;
  const event = { pathParameters: pathParameters } as APIGatewayProxyEventV2;

  const expectedError = new ValidationError('Users are missing.');

  expect(() => {
    validateGetMetricsHandlerRequest(event);
  }).toThrow(expectedError);
});
