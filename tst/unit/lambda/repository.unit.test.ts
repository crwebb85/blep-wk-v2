import * as repository from '@lambda/repository';

test('addApiKey must resolve and not throw an error', async () => {
  const apiKey = '3748c316-4784-45ed-a851-86edee34fb33';

  expect(repository.saveApiKey(apiKey)).resolves.not.toThrow();
});

test('addUserId must resolve without throwing an error.', async () => {
  const apiKey = 'dcde920d-0aff-4e61-8f55-c7a91692a2b1';
  const userId = 'Muppet1';

  expect(repository.saveUserId(apiKey, userId)).resolves.not.toThrow();
});

test('fetchUserId returns the userId for the apiKey.', async () => {
  const apiKey = 'b2bde30e-6035-47e4-9085-9f09c141ee76';
  const userId = 'Muppet1';
  await repository.saveUserId(apiKey, userId);
  expect(await repository.findUserIdByApiKey(apiKey)).toEqual(userId);
});
