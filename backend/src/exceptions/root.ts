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
	STORE_LOCATION_NOT_SET = 422,
	CLIENT_NOT_FOUND = 404,
	COUPON_NOT_FOUND = 404,
	COUPON_CODE_EXISTS = 400,
	COUPON_ALREADY_APPLIED = 400,
	STORE_ID_REQUIRED = 400,
	STORE_NOT_FOUND = 404,
	SEGMENT_NOT_FOUND = 404,
	SPECIAL_DATE_NOT_FOUND = 404,
	SPECIAL_DATE_IN_USE = 409,
	TEMPLATE_NOT_FOUND = 404,
	TEMPLATE_IN_USE = 409,
	CAMPAIGN_NOT_FOUND = 404,
	CAMPAIGN_ALREADY_DISPATCHED = 400,
	VARIABLE_COUNT_MISMATCH = 400,
	COUPON_REQUIRED_FOR_TEMPLATE = 400,
	COUPON_MISSING_REQUIRED_FIELD = 400,
	TEXT_VARIABLE_VALUE_REQUIRED = 400
}
