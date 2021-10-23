import DynamoDB from 'aws-sdk/clients/dynamodb';
import { MetricEntity } from '@lambda/entities';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

export const TABLE_NAME = process.env['MAIN_TABLE_NAME'] ?? 'table';

const isTest = process.env.JEST_WORKER_ID;

type DocumentClientConfig = DynamoDB.DocumentClient.DocumentClientOptions & ServiceConfigurationOptions & DynamoDB.ClientApiVersions;

const db = new DynamoDB({
  ...(isTest && { endpoint: process.env.MOCK_DYNAMODB_ENDPOINT, sslEnabled: false, region: 'local-env' }),
});

const config: DocumentClientConfig = {
  service: db,
};
const documentClient = new DynamoDB.DocumentClient(config);

/**
 * Saves a WaniKani API key to the database.
 * @param apiKey
 * @returns {Promise<void>}
 */
export async function saveApiKey(apiKey: string): Promise<void> {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      pk: 'api-keys',
      sk: apiKey,
    },
    ConditionExpression: 'attribute_not_exists(sk)',
  };

  await documentClient.put(params).promise();
}

/**
 * Finds all WaniKani API keys.
 * @returns {Promise<string[]|undefined>} all WaniKani API keys
 */
export async function findAllApiKeys(): Promise<string[]> {
  const params = {
    TableName: TABLE_NAME,
    ConsistentRead: false,
    ExpressionAttributeValues: {
      ':pkValue': 'api-keys',
    },
    KeyConditionExpression: 'pk = :pkValue',
  };
  const result = await documentClient.query(params).promise();
  const apiKeys = result['Items']?.map((item) => item['sk']);
  return apiKeys ?? [];
}

/**
 * Find the WaniKani user ID for an API key.
 * @param apiKey
 * @returns {Promise<string>} users WaniKani user ID
 */
export async function findUserIdByApiKey(apiKey: string): Promise<string | undefined> {
  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeValues: {
      ':pkValue': 'api-keys',
      ':skValue': apiKey,
    },
    KeyConditionExpression: 'pk = :pkValue and sk = :skValue',
  };
  const result = await documentClient.query(params).promise();
  return result['Items']?.[0]?.['data'];
}

/**
 * Saves WaniKani user ID for an API key.
 * @param apiKey
 * @param userId
 * @returns
 */
export async function saveUserId(apiKey: string, userId: string): Promise<void> {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      pk: 'api-keys',
      sk: apiKey,
      data: userId,
    },
  };
  await documentClient.put(params).promise();
}

/**
 * Saves a `MetricEntity`.
 * @param metric
 * @param userId
 * @param date
 * @returns
 */
export async function saveMetric(metric: MetricEntity, userId: string, date: Date): Promise<void> {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  const params = {
    TableName: TABLE_NAME,
    Item: {
      pk: `metric#${userId}`,
      sk: `${date.getTime()}`,
      data: metric,
    },
  };
  await documentClient.put(params).promise();
}

/**
 * Finds the user's `MetricEntity`s between the `startDate` and `endDate`.
 * If `endDate` is undefined, return the user's `MetricEntity`s on the same day as the `startDate`.
 * @param userId
 * @param startDate
 * @param endDate
 * @returns {Promise<MetricEntity[]>} the user's metrics for the date range.
 */
export async function findMetrics(userId: string, startDate: Date, endDate: Date | undefined): Promise<MetricEntity[]> {
  if (!endDate) {
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate = new Date();
    endDate.setUTCDate(startDate.getUTCDate() + 1);
  }

  const params = {
    TableName: TABLE_NAME,
    ConsistentRead: false,
    ExpressionAttributeValues: {
      ':pkValue': `metric#${userId}`,
      ':startDate': `${startDate.getTime()}`,
      ':endDate': `${endDate.getTime()}`,
    },
    KeyConditionExpression: 'pk = :pkValue and sk BETWEEN :startDate AND :endDate',
  };

  const result = await documentClient.query(params).promise();
  const metrics = result['Items']?.map((item) => item['data']);

  return metrics ?? [];
}
