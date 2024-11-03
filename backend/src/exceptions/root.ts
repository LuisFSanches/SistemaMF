//message, status, code, error codes

export class HttpException extends Error {
  message: string;
  errorCode: ErrorCodes;
  statusCode: number;
  errors: ErrorCodes;
  constructor(message: string, errorCode: any, statusCode: number, errors: any) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors
  }
}

export enum ErrorCodes {
  USER_NOT_FOUND = 400,
  USER_ALREADY_EXISTS = 400,
  INCORRECT_PASSWORD = 400,
  UNAUTHORIZED = 401,
  SYSTEM_ERROR = 500
}
