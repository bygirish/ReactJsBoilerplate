// import { LocalStorage, StorageKeys } from "@utils/LocalStorage.ts";

// import { IApiClient } from "@common/network/interfaces";
// import { ICheckUserExist, IForgotPassword, ILoginPayload, ILogoutModel, IUserModel } from "@common/redux/auth/interface";

// import { ApiClient } from "@network/client";
// import uuid from 'uuid';
// import { APIv1 } from "@common/network/constants";

// export const ENDPOINTS = {
//     login: () => `${APIv1}/iamservice/login`,
//     checkUserExist: () => `${APIv1}/iamservice/checkUserExist`,
//     register: () => `${APIv1}/iamservice/register`,
//     resendVerifyMail: () => `${APIv1}/iamservice/resendVerifyLink`,
//     forgotPassword: () => `${APIv1}/iamservice/forgotPassword`,
//     changePassword: () => `${APIv1}/iamservice/changePassword`,
//     registerUser: (id: number) => `${APIv1}/users/${id}/register`,
//     unregister: (id: number) => `${APIv1}/users/${id}/register`,
//     deleteToken: () => `${APIv1}/token`,
// }

// class AuthRepository {
//     private apiClient: IApiClient;
//     constructor(apiClient: IApiClient) {
//         this.apiClient = apiClient;
//     }

//     public login = async (payload: ILoginPayload) => {
//         const response = await this.apiClient.post(ENDPOINTS.login(), payload);
//         return response;
//     }

//     public checkUserExist = async (payload: ICheckUserExist) => {
//         const response = await this.apiClient.post(ENDPOINTS.checkUserExist(), payload);
//         return response;
//     }

//     public register = async (payload: ILoginPayload) => {
//         const response = await this.apiClient.post(ENDPOINTS.register(), payload);
//         return response;
//     }

//     public resendVerifyMail = async (payload: ILoginPayload) => {
//         const response = await this.apiClient.post(ENDPOINTS.resendVerifyMail(), payload);
//         return response;
//     }

//     public forgotPassword = async (payload: IForgotPassword): Promise<{}> => {
//         const response = await this.apiClient.post(ENDPOINTS.forgotPassword(), payload);
//         return response;
//     }

//     public changePassword = async(payload: ILoginPayload): Promise<{}> => {
//         const response = await this.apiClient.post(ENDPOINTS.changePassword(), payload);
//         return response;
//     }

//     public getApiClient = (): IApiClient => {
//         return this.apiClient;
//     }

//     public registerUser = async (id: number, fcmToken: string, platform?: string): Promise<any> => {
//         const devicePlatform = platform || '';
//         const Uuid = uuid.v1();
//         const data = {device: {platform: devicePlatform, token: fcmToken, installationId: Uuid}};
//         const response = await this.apiClient.put(ENDPOINTS.registerUser(id), data);
//         await LocalStorage.set<string>(StorageKeys.USER_UUID, Uuid);
//         return response;
//     }

//     public logout = async (data: ILogoutModel): Promise<any> => {
//         const user: IUserModel | null = await LocalStorage.get<IUserModel>(StorageKeys.USER);
//         // const userId = getLoggedInUserId();
//         let response = null;
//         if ( user && user.id ) {
//           response = await this.apiClient.delete(ENDPOINTS.unregister(user.id), data);
//         }
//         return response;
//     }

//     public deleteAuthToken = async ():  Promise<any> => {
//       const response = await this.apiClient.delete(ENDPOINTS.deleteToken());
//       return response;
//     }
// }

// const authRepository = new AuthRepository(ApiClient);

// export { authRepository as AuthRepository };
