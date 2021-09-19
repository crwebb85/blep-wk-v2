import { GetMetricsRequest, Metric } from '@lambda/models';
import * as service from '@lambda/core';
import * as repository from '@lambda/repository';
import { mocked } from 'ts-jest/utils';

jest.mock('@lambda/repository');

test('For each of the API keys, getMetrics should return the most recent metric for each of the corresponding users. ', () => {
  const apiKey1 = '63bc8245-eefc-46f0-a82d-9452df542182';
  const apiKey2 = '0d99a940-1eee-4147-9cfe-f0f2aca6801b';

  const expectedGetMetricsRequest = {
    wkApiKeys: [apiKey1, apiKey2],
  } as GetMetricsRequest;

  const username1 = 'Muppet1';
  const metric1 = {
    updatedAt: new Date(),
    availableReviewCount: 900,
    currentLevel: 10,
    hoursIn: 500,
    srsLevels: {
      total: [50, 100, 420, 200, 50, 50, 25, 1, 3, 1],
      radical: [16, 34, 69, 67, 17, 17, 9, 1, 3, 1],
      kanji: [17, 33, 175, 67, 17, 17, 8, 0, 0, 0],
      vocabulary: [17, 33, 176, 66, 16, 16, 8, 0, 0, 0],
    },
    username: username1,
  } as Metric;

  const username2 = 'Muppet2';
  const metric2 = {
    updatedAt: new Date(),
    availableReviewCount: 900,
    currentLevel: 10,
    hoursIn: 400,
    srsLevels: {
      total: [50, 100, 420, 200, 50, 50, 25, 1, 3, 1],
      radical: [16, 34, 69, 67, 17, 17, 9, 1, 3, 1],
      kanji: [17, 33, 175, 67, 17, 17, 8, 0, 0, 0],
      vocabulary: [17, 33, 176, 66, 16, 16, 8, 0, 0, 0],
    },
    username: username2,
  } as Metric;

  const mockedRepository = mocked(repository, true);
  mockedRepository.getUserID = jest.fn().mockResolvedValueOnce(username1).mockResolvedValueOnce(username2);

  mockedRepository.getMetrics = jest.fn().mockResolvedValueOnce([metric1]).mockResolvedValueOnce([metric2]);

  const expectedResponse = [metric1, metric2];

  expect(service.getMetrics(expectedGetMetricsRequest)).resolves.toEqual(expectedResponse);
});

test('Unknown API keys will add the API key to the repository, and the API key will be skipped when fetching the metrics.', () => {
  const apiKey1 = '16fb3f53-2d45-48b4-a559-7b4898b8d6ce';
  const apiKey2 = 'b18c8d16-a911-4ace-b19b-fa805cbb4cf1';

  const expectedGetMetricsRequest = {
    wkApiKeys: [apiKey1, apiKey2],
  } as GetMetricsRequest;

  const username1 = undefined;

  const username2 = 'Muppet2';
  const metric2 = {
    updatedAt: new Date(),
    availableReviewCount: 900,
    currentLevel: 10,
    hoursIn: 400,
    srsLevels: {
      total: [50, 100, 420, 200, 50, 50, 25, 1, 3, 1],
      radical: [16, 34, 69, 67, 17, 17, 9, 1, 3, 1],
      kanji: [17, 33, 175, 67, 17, 17, 8, 0, 0, 0],
      vocabulary: [17, 33, 176, 66, 16, 16, 8, 0, 0, 0],
    },
    username: username2,
  } as Metric;

  const mockedRepository = mocked(repository, true);
  mockedRepository.getUserID = jest.fn().mockResolvedValueOnce(username1).mockResolvedValueOnce(username2);
  mockedRepository.addApiKey = jest.fn().mockImplementation(async () => {
    return;
  });
  mockedRepository.getMetrics = jest.fn().mockResolvedValueOnce([metric2]);

  const expectedResponse = [metric2];

  expect(service.getMetrics(expectedGetMetricsRequest)).resolves.toEqual(expectedResponse);
});

test('If the repository cannot find a metric for the user, then skip the metric in the returned array.', () => {
  const apiKey1 = '59b86c1f-81cd-4ce9-903b-b1b6cbc3b48e';
  const apiKey2 = '51f04591-a736-4f53-8c56-3b3ae78d9d8c';

  const expectedGetMetricsRequest = {
    wkApiKeys: [apiKey1, apiKey2],
  } as GetMetricsRequest;

  const username1 = 'Muppet1';

  const mockedRepository = mocked(repository, true);
  mockedRepository.getUserID = jest.fn().mockResolvedValueOnce(username1);
  mockedRepository.getMetrics = jest.fn().mockResolvedValueOnce([]);

  const expectedResponse: Metric[] = [];

  expect(service.getMetrics(expectedGetMetricsRequest)).resolves.toEqual(expectedResponse);
});
