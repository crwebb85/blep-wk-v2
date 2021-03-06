/**
 * Abstract class for errors that can be exposed to the user.
 */
export abstract class ClientError extends Error {
  public httpStatusCode: number;
  constructor(msg: string) {
    super(msg);
  }
}

export class ForbiddenError extends ClientError {
  constructor(msg: string) {
    super(msg);
    this.name = 'Forbidden';
    this.httpStatusCode = 403;
  }
}

export class NotFoundError extends ClientError {
  constructor(msg: string) {
    super(msg);
    this.name = 'NotFoundError';
    this.httpStatusCode = 404;
  }
}

export class ValidationError extends ClientError {
  constructor(msg: string) {
    super(msg);
    this.name = 'ValidationError';
    this.httpStatusCode = 400;
  }
}

export class MethodNotAllowedError extends ClientError {
  constructor(msg: string) {
    super(msg);
    this.name = 'MethodNotAllowedError';
    this.httpStatusCode = 405;
  }
}

export class UnimplementedAPIError extends ForbiddenError {
  constructor(msg = 'API under construction') {
    super(msg);
  }
}
