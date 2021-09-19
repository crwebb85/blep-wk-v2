import { ForbiddenError, MethodNotAllowedError, NotFoundError, UnimplementedAPIError, ValidationError } from '@lambda/errors';

test('ForbiddenError constructor', () => {
  const message = 'Ooh no you encountered a wild ForbiddenError.';
  const error = new ForbiddenError(message);
  expect(error.message).toBe(message);
  expect(error.httpStatusCode).toBe(403);
  expect(error.name).toBe('Forbidden');
});

test('NotFoundError constructor', () => {
  const message = 'Ooh no you encountered a wild NotFoundError.';
  const error = new NotFoundError(message);
  expect(error.message).toBe(message);
  expect(error.httpStatusCode).toBe(404);
  expect(error.name).toBe('NotFoundError');
});

test('ValidationError constructor', () => {
  const message = 'Ooh no you encountered a wild ValidationError.';
  const error = new ValidationError(message);
  expect(error.message).toBe(message);
  expect(error.httpStatusCode).toBe(400);
  expect(error.name).toBe('ValidationError');
});

test('MethodNotAllowedError constructor', () => {
  const message = 'Ooh no you encountered a wild MethodNotAllowedError.';
  const error = new MethodNotAllowedError(message);
  expect(error.message).toBe(message);
  expect(error.httpStatusCode).toBe(501);
  expect(error.name).toBe('MethodNotAllowedError');
});

test('UnimplementedAPIError constructor', () => {
  const error = new UnimplementedAPIError();
  expect(error.message).toBe('API under construction');
  expect(error.httpStatusCode).toBe(403);
  expect(error.name).toBe('Forbidden');
});
