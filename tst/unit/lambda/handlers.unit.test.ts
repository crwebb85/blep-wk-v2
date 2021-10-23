import * as handlers from '@lambda/handlers';
import * as service from '@lambda/core';

import { APIGatewayProxyEventPathParameters, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { GetMetricsResponse, Metric, SrsStageCounts } from '@lambda/models';

import { mocked } from 'ts-jest/utils';

jest.mock('@lambda/core');

test('Metric Handler should return a list of metrics as an APIGatewayProxyResultV2', () => {
  const apiKey1 = '63bc8245-eefc-46f0-a82d-9452df542182';
  const apiKey2 = '0d99a940-1eee-4147-9cfe-f0f2aca6801b';
  const pathParameters: APIGatewayProxyEventPathParameters = { users: `${apiKey1},${apiKey2}` };
  const event = { pathParameters: pathParameters } as APIGatewayProxyEventV2;

  const metric1: Metric = {
    wkApiKey: apiKey1,
    updatedAt: new Date().getTime(),
    availableReviewCount: 900,
    currentLevel: 10,
    hoursIn: 500,
    srsLevels: {
      total: new SrsStageCounts(50, 100, 420, 200, 50, 50, 25, 1, 3, 1),
      radical: new SrsStageCounts(16, 34, 69, 67, 17, 17, 9, 1, 3, 1),
      kanji: new SrsStageCounts(17, 33, 175, 67, 17, 17, 8, 0, 0, 0),
      vocabulary: new SrsStageCounts(17, 33, 176, 66, 16, 16, 8, 0, 0, 0),
    },
    username: 'Muppet1',
  };

  const metric2: Metric = {
    wkApiKey: apiKey2,
    updatedAt: new Date().getTime(),
    availableReviewCount: 900,
    currentLevel: 10,
    hoursIn: 400,
    srsLevels: {
      total: new SrsStageCounts(50, 100, 420, 200, 50, 50, 25, 1, 3, 1),
      radical: new SrsStageCounts(16, 34, 69, 67, 17, 17, 9, 1, 3, 1),
      kanji: new SrsStageCounts(17, 33, 175, 67, 17, 17, 8, 0, 0, 0),
      vocabulary: new SrsStageCounts(17, 33, 176, 66, 16, 16, 8, 0, 0, 0),
    },
    username: 'Muppet2',
  };

  const metrics = [metric1, metric2];

  const mockedService = mocked(service, true);
  mockedService.getMetrics = jest.fn().mockResolvedValue(metrics);

  const response: GetMetricsResponse = {
    metrics: metrics,
  };

  const expectedResponse: APIGatewayProxyResultV2 = {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
  };

  expect(handlers.getMetricsHandler(event)).resolves.toStrictEqual(expectedResponse);
});
