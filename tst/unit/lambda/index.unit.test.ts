import * as handlers from '@lambda/handlers';

import { APIGatewayProxyEventV2, Context } from 'aws-lambda';

import { ErrorResponse } from '@lambda/models';
import { ValidationError } from '@lambda/errors';
import { handler } from '@lambda/index';
import { mocked } from 'ts-jest/utils';

jest.mock('@lambda/handlers');

test('Invalid routes should throw an error.', () => {
  const event = {
    routeKey: 'GET /unknownResource',
  } as APIGatewayProxyEventV2;
  const context = {} as Context;

  expect(handler(event, context)).rejects.toThrow(Error);
});

test('Validation errors should be sent to the client.', () => {
  const event = {
    routeKey: 'GET /metrics', //a valid route key
  } as APIGatewayProxyEventV2;
  const context = {} as Context;

  const clientError = new ValidationError('testing validation error');

  const mockedHandlers = mocked(handlers, true);
  mockedHandlers.getMetricsHandler.mockImplementationOnce(() => {
    throw clientError;
  });

  const errorResponse: ErrorResponse = {
    error: clientError.name,
    message: clientError.message,
  };

  const expectedResponse = {
    statusCode: clientError.httpStatusCode,
    body: JSON.stringify(errorResponse),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
  };

  expect(handler(event, context)).resolves.toStrictEqual(expectedResponse);
});

test('If anything is thrown within the handler that is not an error, the handler should throw a normal error.', () => {
  const event = {
    routeKey: 'GET /metrics', //a valid route key
  } as APIGatewayProxyEventV2;
  const context = {} as Context;

  const mockedHandlers = mocked(handlers, true);
  mockedHandlers.getMetricsHandler.mockImplementationOnce(() => {
    throw 'this is definitely an error ;)';
  });

  const expectedResponse = new Error('Internal service error.');

  expect(handler(event, context)).rejects.toThrowError(expectedResponse);
});
