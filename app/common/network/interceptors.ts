import { AxiosInstance, AxiosResponse } from 'axios';
// import { ENDPOINTS } from '@repositories/AuthRepository';
import {
  ANONYMOUS_ROUTES,
  AUTH_TOKEN_EXPIRED_MESSAGE,
  ERR_UNSUPPORTED_VERSION,
  HTTP_STATUS_CODES,
  UNDER_MAINTENANCE,
} from './constants';
import { IApiClient } from '@network/interfaces';
import { getAppName, getAppVersion, getDevicePlatform, getClientTraceId, getClientSessionId } from '@utils/DeviceInfoUtils';
// import { IMaintenanceInfo, updateAppUpgradeFlag, updateServerMaintenanceFlag } from '@redux/root/actions';
// import { StoreProviderService } from '@services/StoreProviderService';
import { getLanguage } from '@utils/LanguageUtils';
import { StorageKeys } from '@utils/LocalStorage';

export const addAuthorizationRequestInterceptor = (axiosInstance: AxiosInstance, apiClient: IApiClient)
  : AxiosInstance => {
  axiosInstance.interceptors.request.use(async (config) => {

    // if (!ANONYMOUS_ROUTES.includes(config.url || '')
    //   && !(config.method === 'put' && ANONYMOUS_ROUTES.includes(config.url || ''))) {
    //   if (!config.headers) {
    //     config.headers = {};
    //   }
    //   const authHelper = apiClient.getAuthHelper();
    //   if (authHelper) {
    //     const accessToken = await authHelper.getAccessToken();
    //     config.headers.Authorization = `Token ${accessToken}`;
    //   }
    // }
    // // below headers are added to identify app update.
    // const languageCode = getLanguage();
    // config.headers = {
    //   ...config.headers,
    //   appName: getAppName(),
    //   platform: getDevicePlatform(),
    //   appVersion: getAppVersion(),
    //   clientTraceId: getClientTraceId && getClientTraceId(),
    //   clientSessionId: getClientSessionId && getClientSessionId(),
    // };
    // config.headers['Accept-Language'] = languageCode;


    const token = localStorage.getItem(StorageKeys.ACCESS_TOKEN);
    config.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    };

    // if(token && config.url !== ENDPOINTS.login()) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  return axiosInstance;
};

export const addExpiredAuthorizationTokenResponseInterceptor = (axiosInstance: AxiosInstance, apiClient: IApiClient)
  : AxiosInstance => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return Promise.resolve(response);
    },
    async (error: any) => {
      const originalRequest = error.config;

      const authHelper = apiClient.getAuthHelper();
      if (isAuthorizationTokenExpiredError(error) && !originalRequest._retry && authHelper) {
        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        await authHelper.refreshTokens();
        const accessToken = await authHelper.getAccessToken();
        originalRequest.headers.Authorization = `Token ${accessToken}`;
        originalRequest._retry = true;
        return await apiClient.request(originalRequest);
      }
      errorHandler(error);
      return Promise.reject(error);
    });
  return axiosInstance;
};

const isAuthorizationTokenExpiredError = (error: any): boolean => {
  if (error.response &&
    error.response.data &&
    HTTP_STATUS_CODES.Unauthorized === error.response.status &&
    AUTH_TOKEN_EXPIRED_MESSAGE === error.response.data.data.message) {
    return true;
  }
  return false;
};

const errorHandler = (error: any) => {
  if (error.response && error.response.data && error.response.data.data) {
    const errorData = error.response.data.data;
    switch (errorData.code) {
      case ERR_UNSUPPORTED_VERSION:
        // StoreProviderService.getStore().dispatch(updateAppUpgradeFlag(true));
        break;
      case UNDER_MAINTENANCE:
        // const maintenance: IMaintenanceInfo = {
        //   showServerMaintenanceInfo: true,
        //   message: errorData.message,
        //   description: errorData.description,
        // };
        // StoreProviderService.getStore().dispatch(updateServerMaintenanceFlag(maintenance));
        break;
      default: // do nothing
    }
  }
};
