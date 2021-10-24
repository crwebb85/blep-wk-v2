import * as repository from '@lambda/repository';

import { MetricEntity } from '@lambda/entities';

test('Save API key resolves without throwing an error', async () => {
  const apiKey = '3748c316-4784-45ed-a851-86edee34fb33';

  expect(repository.saveApiKey(apiKey)).resolves.not.toThrow();
});

test('If no api keys, findAllApiKeys returns empty list', async () => {
  const apiKeys = await repository.findAllApiKeys();
  expect(apiKeys).toEqual([]);
});

test('Find all saved api keys', async () => {
  const apiKey1 = 'c1f3b0f1-d334-4a2f-bd7a-230f11386cc5';
  const apiKey2 = '3172a950-3413-11ec-8d3d-0242ac130003';
  await repository.saveApiKey(apiKey1);
  await repository.saveApiKey(apiKey2);

  const apiKeys = await repository.findAllApiKeys();
  expect(apiKeys).toHaveLength(2);
  expect(apiKeys).toEqual(expect.arrayContaining([apiKey1, apiKey2]));
});

test('Save user must resolve without throwing an error.', async () => {
  const apiKey = 'dcde920d-0aff-4e61-8f55-c7a91692a2b1';
  const userId = 'Muppet1';

  expect(repository.saveUserId(apiKey, userId)).resolves.not.toThrow();
});

test('Find saved user by WaniKani API key.', async () => {
  const apiKey = 'b2bde30e-6035-47e4-9085-9f09c141ee76';
  const userId = 'Muppet1';
  await repository.saveUserId(apiKey, userId);
  expect(await repository.findUserIdByApiKey(apiKey)).toEqual(userId);
});

test('Save metric resolves without throwing an error', () => {
  const username = 'Muppet1';
  const metricEntity: MetricEntity = {
    updatedAt: new Date().getTime(),
    availableReviewCount: 900,
    currentLevel: 10,
    hoursIn: 500,
    srsLevels: {
      total: [50, 100, 420, 200, 50, 50, 25, 1, 3, 1],
      radical: [16, 34, 69, 67, 17, 17, 9, 1, 3, 1],
      kanji: [17, 33, 175, 67, 17, 17, 8, 0, 0, 0],
      vocabulary: [17, 33, 176, 66, 16, 16, 8, 0, 0, 0],
    },
    username: username,
  };
  const currentDate = new Date();

  expect(repository.saveMetric(metricEntity, username, currentDate)).resolves.not.toThrow();
});

test('Find metrics for date range', async () => {
  const username = 'Muppet1';
  const currentDate = new Date();

  const currentMetricEntity: MetricEntity = {
    updatedAt: currentDate.getTime(),
    availableReviewCount: 900,
    currentLevel: 10,
    hoursIn: 500,
    srsLevels: {
      total: [50, 100, 420, 200, 50, 50, 25, 1, 3, 1],
      radical: [16, 34, 69, 67, 17, 17, 9, 1, 3, 1],
      kanji: [17, 33, 175, 67, 17, 17, 8, 0, 0, 0],
      vocabulary: [17, 33, 176, 66, 16, 16, 8, 0, 0, 0],
    },
    username: username,
  };

  await repository.saveMetric(currentMetricEntity, username, currentDate);

  const previousDate = new Date();
  previousDate.setUTCDate(currentDate.getUTCDate() - 1);
  const previousMetricEntity: MetricEntity = {
    updatedAt: previousDate.getTime(),
    availableReviewCount: 800,
    currentLevel: 9,
    hoursIn: 450,
    srsLevels: {
      total: [50, 100, 420, 200, 50, 50, 25, 1, 3, 1],
      radical: [16, 34, 69, 67, 17, 17, 9, 1, 3, 1],
      kanji: [17, 33, 175, 67, 17, 17, 8, 0, 0, 0],
      vocabulary: [17, 33, 176, 66, 16, 16, 8, 0, 0, 0],
    },
    username: username,
  };

  await repository.saveMetric(previousMetricEntity, username, previousDate);

  const startDate = previousDate;
  const endDate = currentDate;

  const metrics = await repository.findMetrics(username, startDate, endDate);
  expect(metrics).toHaveLength(2);
  expect(metrics[0]).toMatchObject(previousMetricEntity);
  expect(metrics[1]).toMatchObject(currentMetricEntity);
});

test('findMetrics for a single day', async () => {
  const username = 'Muppet1';
  const currentDate = new Date();

  const currentMetricEntity: MetricEntity = {
    updatedAt: currentDate.getTime(),
    availableReviewCount: 900,
    currentLevel: 10,
    hoursIn: 500,
    srsLevels: {
      total: [50, 100, 420, 200, 50, 50, 25, 1, 3, 1],
      radical: [16, 34, 69, 67, 17, 17, 9, 1, 3, 1],
      kanji: [17, 33, 175, 67, 17, 17, 8, 0, 0, 0],
      vocabulary: [17, 33, 176, 66, 16, 16, 8, 0, 0, 0],
    },
    username: username,
  };

  await repository.saveMetric(currentMetricEntity, username, currentDate);

  const metrics = await repository.findMetrics(username, currentDate, undefined);
  expect(metrics).toHaveLength(1);
  expect(metrics[0]).toMatchObject(currentMetricEntity);
});
