import { AxiosError, AxiosResponse } from 'axios';
import { Logger} from '@utils/Logger';
import { isOfType } from '@utils/ObjectHelper';
import { IApiClientErrorDetails, ApiClientError } from './apiClientError';
import {
  HTTP_STATUS_CODES,
  DEFAULT_ERROR_MESSAGE,
  ERR_INTERNAL_SERVER_ERROR,
  SOMETHING_WENT_WRONG,
  NO_NETWORK
} from './constants';

const responseEnvelopeStatuses = ['SUCCESS', 'ERROR', 'FAILURE'];

interface IApiResponseErrorType {
  error: {
    code: string;
    message: string;
    description: string;
    errors?: [];
  };
}

interface IApiResponseEnvelope {
  status: string;
  data: IApiResponseErrorType;
}

export function successHandler(response: AxiosResponse) {
  // Check if the response has a body
  const responseBody = response.data;

  if (!responseBody) {
    // Would this even occur? Logging it just in case
    Logger.warn(`No response body for success`, {
      response : response
    });

    // Return empty object to prevent null propagation
    return {};
  }

  // Check for HTTP Status Code 204
  if (HTTP_STATUS_CODES.NoContent === response.status) {
    // The response body would be empty in this case
    return {};
  }

  // Check if the response body is a JSON
  if (!isOfType('array', responseBody) && !isOfType('object', responseBody)) {
    Logger.info(typeof responseBody);
    Logger.warn(`Response is not a json`, {
      response: responseBody
    });
  }

  // Map the response body to the response envelope
  const responseEnvelope = responseBody as IApiResponseEnvelope;
  if (!responseEnvelope.status || responseEnvelopeStatuses.indexOf(responseEnvelope.status.toLocaleUpperCase()) < 0) {
    Logger.error(`Invalid response status in envelope`, {
      responseEnvelope: responseEnvelope
    });
  }

  return responseEnvelope.data || {};
}

export function errorHandler(error: AxiosError) {

  let errorDetails: IApiClientErrorDetails = {
    message: DEFAULT_ERROR_MESSAGE,
  } as IApiClientErrorDetails;

  // no network
  if (error.message && error.message === 'Network Error') {
    // Logger.error('Network Error: ', {
    //   error: error
    // });
    return new ApiClientError(NO_NETWORK, errorDetails);
  }

  // timeout
  if (error.code && 'ECONNABORTED' === error.code) {
    Logger.error('Connectin Timeout Error: ', {
      error: error
    });
    return new ApiClientError(NO_NETWORK, errorDetails);
  }

  // Check if response is defined on error
  if (!error.response) {
    // We don't know anything about the error
    Logger.error("Don't know anything about the error. Error: ", {
      error: error
    });
    return new ApiClientError(SOMETHING_WENT_WRONG, errorDetails);
  }

  const errorResponse = error.response;

  // Look for response headers
  if (!errorResponse.headers) {
    Logger.error("Empty response headers. Error: ", {
      error: error
    });
    return new ApiClientError(SOMETHING_WENT_WRONG, errorDetails);
  }

  // Check if the response is a JSON
  const contentType = errorResponse.headers['content-type'];
  if (!contentType || contentType.indexOf('application/json') < 0) {
    // The response content type is not correct
    Logger.error("Response is not a json. Response content: ", {
      error: errorResponse
    });

    errorDetails.statusCode = errorResponse.status;
    return new ApiClientError(SOMETHING_WENT_WRONG, errorDetails);
  }

  // Check for HTTP status code
  if (errorResponse.status > 500) {
    // This may not be from the backend
    Logger.error("Timeout error, possibly. Response content: ", {
      error: errorResponse
    });
    errorDetails.statusCode = errorResponse.status;
    return new ApiClientError(SOMETHING_WENT_WRONG, errorDetails);
  }

  // Check if we have the response body
  const responseBody = errorResponse.data;
  if (!responseBody) {
    Logger.error("Empty response body. Response content: ", {
      error: errorResponse
    });
    errorDetails.statusCode = errorResponse.status;
    return new ApiClientError(SOMETHING_WENT_WRONG, errorDetails);
  }

  // Map the response body to the response envelope
  const apiResponseEnvelope: IApiResponseEnvelope = responseBody as IApiResponseEnvelope;
  const apiResponseError = extractErrorFromResponseEnvelope(apiResponseEnvelope);
  const errorMessage = apiResponseError.message === ERR_INTERNAL_SERVER_ERROR ?
    SOMETHING_WENT_WRONG : apiResponseError.message;
  errorDetails = {
    statusCode: errorResponse.status,
    code: apiResponseError.code || SOMETHING_WENT_WRONG,
    message: errorMessage || SOMETHING_WENT_WRONG,
    description: apiResponseError.message || '',
    errors: apiResponseError.errors || [],
  } as IApiClientErrorDetails;

  return new ApiClientError(errorDetails.message, errorDetails);
}

const extractErrorFromResponseEnvelope = (envelope: IApiResponseEnvelope): IApiResponseErrorType['error'] => {
  if (envelope.data && envelope.data.error) {
    return envelope.data.error;
  }

  Logger.info(`Unable to parse error from response envelope:`, {
    envelope: envelope,
  });
  return emptyErrorType();
};

export const emptyErrorType = (): IApiResponseErrorType['error'] => ({
  code: '',
  message: DEFAULT_ERROR_MESSAGE,
  description: '',
  errors: [],
});
