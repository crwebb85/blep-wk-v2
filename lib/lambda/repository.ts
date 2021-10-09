import { MetricEntity } from '@lambda/entities';
import { UnimplementedAPIError } from '@lambda/errors';

/**
 * Adds a WaniKani API key to the database if it does not already exist. The data field will be replaced by the
 * user ID in another function.
 * @param apiKey
 * @returns {Promise<PromiseResult<*, E>>}
 */
export async function addApiKey(apiKey: string): Promise<void> {
  //TODO
  throw new UnimplementedAPIError();
}

/**
 * Returns all of the WaniKani API keys in the database.
 * @returns {Promise<string[]|undefined>} array of all API keys in database
 */
export async function getAllApiKeys(): Promise<string[] | undefined> {
  //TODO
  throw new UnimplementedAPIError();
}

/**
 * Returns the corresponding user ID for an API key.
 * @param apiKey
 * @returns {Promise<string>} users UUID that matches the WaniKani API key
 */
export async function getUserID(apiKey: string): Promise<string | undefined> {
  //TODO
  throw new UnimplementedAPIError();
}

/**
 * Returns the metrics records and between the startDate and endDate.
 * If endDate is undefined the metric for the startDate will be returned.
 * @param userID
 * @param startDate
 * @param endDate
 * @returns {Promise<MetricEntity[]>} an array of metrics.
 */
export async function getMetrics(userID: string, startDate: Date, endDate: Date | undefined): Promise<MetricEntity[]> {
  //TODO
  throw new UnimplementedAPIError();
}
