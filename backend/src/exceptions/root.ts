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
	BAD_REQUEST = 404,
	SYSTEM_ERROR = 500,
	AUTHORIZED = 200,
	VALIDATION_ERROR = 400,
	STORE_DOES_NOT_SERVE_CITY = 422,
	OUT_OF_DELIVERY_RANGE = 422,
	DELIVERY_RANGE_OVERLAP = 400,
	STORE_LOCATION_NOT_SET = 422
}
