import { UnimplementedAPIError } from '@lambda/errors';
import * as repository from '@lambda/repository';

test('addApiKey is an unimplemented function and should throw an UnimplementedAPIErorr', () => {
  const apiKey = 'dcde920d-0aff-4e61-8f55-c7a91692a2b1';
  const expectedError = new UnimplementedAPIError();

  expect(repository.addApiKey(apiKey)).rejects.toThrow(expectedError);
});

test('getAllApiKeys is an unimplemented function and should throw an UnimplementedAPIErorr', () => {
  const expectedError = new UnimplementedAPIError();

  expect(repository.getAllApiKeys()).rejects.toThrow(expectedError);
});

test('getUserID is an unimplemented function and should throw an UnimplementedAPIErorr', () => {
  const apiKey = 'dcde920d-0aff-4e61-8f55-c7a91692a2b1';
  const expectedError = new UnimplementedAPIError();

  expect(repository.getUserID(apiKey)).rejects.toThrow(expectedError);
});

test('getMetrics is an unimplemented function and should throw an UnimplementedAPIErorr', () => {
  const userID = 'Muppet1';
  const startDate = new Date();
  const expectedError = new UnimplementedAPIError();

  expect(repository.getMetrics(userID, startDate, undefined)).rejects.toThrow(expectedError);
});
