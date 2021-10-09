import * as repository from '@lambda/repository';
import * as service from '@lambda/core';

import { GetMetricsRequest, Metric, SrsStageCounts } from '@lambda/models';

import { mocked } from 'ts-jest/utils';

jest.mock('@lambda/repository');

test('For each of the API keys, getMetrics should return the most recent metric for each of the corresponding users. ', () => {
  const apiKey1 = '63bc8245-eefc-46f0-a82d-9452df542182';
  const apiKey2 = '0d99a940-1eee-4147-9cfe-f0f2aca6801b';

  const expectedGetMetricsRequest: GetMetricsRequest = {
    wkApiKeys: [apiKey1, apiKey2],
  };

  const username1 = 'Muppet1';
  const metric1: Metric = {
    wkApiKey: apiKey1,
    updatedAt: new Date(),
    availableReviewCount: 900,
    currentLevel: 10,
    hoursIn: 500,
    srsLevels: {
      total: new SrsStageCounts(50, 100, 420, 200, 50, 50, 25, 1, 3, 1),
      radical: new SrsStageCounts(16, 34, 69, 67, 17, 17, 9, 1, 3, 1),
      kanji: new SrsStageCounts(17, 33, 175, 67, 17, 17, 8, 0, 0, 0),
      vocabulary: new SrsStageCounts(17, 33, 176, 66, 16, 16, 8, 0, 0, 0),
    },
    username: username1,
  };

  const username2 = 'Muppet2';
  const metric2: Metric = {
    wkApiKey: apiKey2,
    updatedAt: new Date(),
    availableReviewCount: 900,
    currentLevel: 10,
    hoursIn: 400,
    srsLevels: {
      total: new SrsStageCounts(50, 100, 420, 200, 50, 50, 25, 1, 3, 1),
      radical: new SrsStageCounts(16, 34, 69, 67, 17, 17, 9, 1, 3, 1),
      kanji: new SrsStageCounts(17, 33, 175, 67, 17, 17, 8, 0, 0, 0),
      vocabulary: new SrsStageCounts(17, 33, 176, 66, 16, 16, 8, 0, 0, 0),
    },
    username: username2,
  };

  const mockedRepository = mocked(repository, true);
  mockedRepository.getUserID = jest.fn().mockResolvedValueOnce(username1).mockResolvedValueOnce(username2);

  mockedRepository.getMetrics = jest.fn().mockResolvedValueOnce([metric1]).mockResolvedValueOnce([metric2]);

  const expectedResponse = [metric1, metric2];

  expect(service.getMetrics(expectedGetMetricsRequest)).resolves.toEqual(expectedResponse);
});

test('Unknown API keys will add the API key to the repository, and the returned Metric will just contain the WaniKani API key.', () => {
  const apiKey1 = '16fb3f53-2d45-48b4-a559-7b4898b8d6ce';

  const expectedGetMetricsRequest: GetMetricsRequest = {
    wkApiKeys: [apiKey1],
  };

  const username1 = undefined;
  const metric1: Metric = {
    wkApiKey: apiKey1,
  };

  const mockedRepository = mocked(repository, true);
  mockedRepository.getUserID = jest.fn().mockResolvedValueOnce(username1);
  mockedRepository.addApiKey = jest.fn().mockImplementation(async () => {
    return;
  });
  mockedRepository.getMetrics = jest.fn().mockResolvedValueOnce([metric1]);

  const expectedResponse = [metric1];

  expect(service.getMetrics(expectedGetMetricsRequest)).resolves.toEqual(expectedResponse);
});

test('If the repository cannot find a metric for the user, then the returned metric will only contain the WaniKani API key and the username', () => {
  const apiKey1 = '59b86c1f-81cd-4ce9-903b-b1b6cbc3b48e';

  const expectedGetMetricsRequest: GetMetricsRequest = {
    wkApiKeys: [apiKey1],
  };

  const username1 = 'Muppet1';

  const metric1: Metric = {
    wkApiKey: apiKey1,
    username: username1,
  };

  const mockedRepository = mocked(repository, true);
  mockedRepository.getUserID = jest.fn().mockResolvedValueOnce(username1);
  mockedRepository.getMetrics = jest.fn().mockResolvedValueOnce([]);

  const expectedResponse = [metric1];

  expect(service.getMetrics(expectedGetMetricsRequest)).resolves.toEqual(expectedResponse);
});
