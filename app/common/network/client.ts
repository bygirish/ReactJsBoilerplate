import axios, { AxiosInstance, AxiosResponse } from 'axios';
import qs from 'qs';
import { GLOBAL_BASE_URL } from '@network/constants';
import { addAuthorizationRequestInterceptor, addExpiredAuthorizationTokenResponseInterceptor } from '@network/interceptors';
import { IApiClient, IAuthHelper } from '@network/interfaces';
import { errorHandler, successHandler } from '@network/responseHandlers';


const getClient = (baseUrl: string, client: IApiClient): AxiosInstance => {
  let axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 30000,
    // Will convert the array to comma separated values per key
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
  });

  // Add Request Interceptor to add Authorization header
  axiosInstance = addAuthorizationRequestInterceptor(axiosInstance, client);

  // Add Response Interceptor for Authorization token expiry
  axiosInstance = addExpiredAuthorizationTokenResponseInterceptor(axiosInstance, client);

  return axiosInstance;
};

export class ApiClientSinglton implements IApiClient {
  private baseUrl: string;
  private client: AxiosInstance;
  private authHelper?: IAuthHelper = undefined;

  constructor(baseUrl: string) {
    this.client = getClient(baseUrl, this);
    this.baseUrl = baseUrl;
  }

  // TODO: Add response and error handlers here
  public request = (config: any) => {
    /*
    below if is to resolve auth token refresh issue,
    since retried API will have parsed data.
    */
    if (config._retry) {
      return this.client.request(config)
        .then((response) => Promise.resolve(response))
        .catch((error) => Promise.reject(error));
    }
    return this.client.request(config)
      .then((response) => Promise.resolve(successHandler(response)))
      .catch((error) => Promise.reject(errorHandler(error)));
  }

  public get = (url: string, params = {}) => {
    return this.request({
      method: 'GET',
      url,
      params,
    });
  }

  public post = (url: string, data = {}, params = {}) => {
    return this.request({
      method: 'POST',
      url,
      data,
      params,
    });
  }

  public put = (url: string, data = {}, params = {}) => {
    return this.request({
      method: 'PUT',
      url,
      data,
      params,
    });
  }

  public patch = (url: string, data = {}, params = {}) => {
    return this.request({
      method: 'PATCH',
      url,
      data,
      params,
    });
  }

  public delete = (url: string, data = {}) => {
    return this.request({
      method: 'DELETE',
      url,
      data,
    });
  }

  public getAuthHelper = (): IAuthHelper | undefined => this.authHelper;

  public setAuthHelper = (authHelper: IAuthHelper): void => {
    this.authHelper = authHelper;
  }
}
const apiClient = new ApiClientSinglton(GLOBAL_BASE_URL);
export { apiClient as ApiClient };
