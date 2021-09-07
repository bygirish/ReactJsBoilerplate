import config from '@config/index';

export const GLOBAL_BASE_URL = config.BASE_URL;
export const SOCKET_SERVER_URL = `${GLOBAL_BASE_URL}/weChat`;
export const WEB_URL = config.WEB_URL;
export const ADMIN_CONSOLE = config.ADMIN_CONSOLE

// API Versions
export const APIv1 = '/api/v1';
export const APIv2 = '/api/v2';
export const APIv3 = '/api/v3';

export const ANONYMOUS_ROUTES = [
  '/signin',
  '/register',
  '/roles',
  '/users/password',
];
export const AUTH_TOKEN_STORAGE_KEY = '@token';
export const AUTH_TOKEN_EXPIRED_MESSAGE = 'jwt expired';
export const DEFAULT_ERROR_MESSAGE = `Oops, something's not right`;
export const ERR_UNSUPPORTED_VERSION = 'ERR_UNSUPPORTED_VERSION';
export const UNDER_MAINTENANCE = 'UNDER_MAINTENANCE';
export const ERR_PROFILE_NOT_FOUND = 'ERR_PROFILE_NOT_FOUND';
export const ERR_USER_SETTING_DOES_NOT_EXISTS =
  'ERR_USER_SETTING_DOES_NOT_EXISTS';
export const ERR_PAST_TIMESTAMP = 'ERR_PAST_TIMESTAMP';
export const ERR_MEETING_REQUEST_SENT = 'ERR_MEETING_REQUEST_SENT';
export const ERR_MEETING_EXIST = 'ERR_MEETING_EXIST';
export const ERR_INTERNAL_SERVER_ERROR = 'ERR_INTERNAL_SERVER_ERROR';
export const ERR_SURVEY_REQUIRED = 'ERR_SURVEY_REQUIRED';
export const MSG_EMAIL_NOT_FOUND = 'MSG_EMAIL_NOT_FOUND';
export const MSG_INCORRECT_PASSWORD = 'MSG_INCORRECT_PASSWORD';
export const NO_NETWORK = 'Unable to connect. Please check your internet connection.';
export const SOMETHING_WENT_WRONG = 'Something went wrong!';
export const ERR_INVALID_OTP = 'ERR_INVALID_OTP';
export const ERR_INVALID_PASSWORD = 'Invalid Password. Password can not be empty';
export const ERR_CONFIRM_PASSWORD_MISMATCH = 'ERR_CONFIRM_PASSWORD_MISMATCH';
export const ERR_INVALID_EMAIL_ID = 'Invalid Email id found';
export const ERR_PRIVACY_POLICY_NOT_ACCEPTED = 'Privacy policy needs to be accepted';
export const ERR_USER_NOT_FOUND = 'User not found';
export const ERR_USER = 'ERR_USER';
export const ERR_USER_ALREADY_PRESENT = 'ERR_USER_ALREADY_PRESENT';

export const HTTP_STATUS_CODES = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  UnprocessableEntity: 422,
  InternalServerError: 500,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  NotModified: 304,
};
