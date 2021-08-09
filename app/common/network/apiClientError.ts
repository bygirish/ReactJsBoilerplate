export interface IApiClientErrorDetails {
  statusCode?: number;
  code?: string;
  message: string;
  description?: string;
  errors?: [];
}

class ApiClientError extends Error {

  public details?: IApiClientErrorDetails;

  constructor(m: string, details?: IApiClientErrorDetails) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiClientError.prototype);

    this.details = details;
  }

  public toString() {
    return JSON.stringify(this.details);
  }
}

// @ts-ignore
export { ApiClientError };
