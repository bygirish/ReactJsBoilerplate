// export interface ILoginPayload  {
//     password: string,
//     userName: string,
// }

// export interface IAuthState {
//     isWebView: boolean;
//     login: {};
//     checkUserExist: {};
//     register: {};
//     resendVerifyMail: {};
//     forgotPassword: {};
//     changePassword: boolean;
//     isAuthenticated: boolean;
//     loaders: {
//         login: boolean;
//         checkUserExist: boolean;
//         register: boolean;
//         resendVerifyMail: boolean;
//         changePassword: boolean;
//         forgotPassword: boolean;    
//     };
//     errors: {
//         login: string;
//         checkUserExist: string;
//         register: string;
//         resendVerifyMail: string;
//         forgotPassword: string;
//         changePassword: string;
//     }
// }

// export interface ICheckUserExist {
//     userName: string;
// }

// export interface IResendVerifyMail {
//     resendLink: boolean;
//     userVerified: boolean;
// }
// export interface IForgotPassword {
//     userName: string;
// }

// export interface ILogoutModel {
//     device: {
//       installationId: string;
//     };
// }

// export interface IUserModel {
//     id: number;
//     uuid: string;
//     isVerified: boolean;
//     token: IUserToken;
//     role: IUserRole[];
//     isRequirePasswordChange: boolean;
//     isPrivacyPolicyAccepted: boolean;
//     isUserAcceptanceAccepted: boolean;
//     email: string;
// }

// export interface IUserToken {
//     authToken: string;
//     refreshToken: string;
// }

// export interface IUserRole {
//     id: number;
//     name: string;
//     profileId: string;
//     isTM: boolean;
//     ecosystem: {
//       id: number;
//       name: string;
//     }
// }

// export interface ILogoutAction {
//     type: string;
//     payload: string;
// }

// export interface ICreateProfilePayload {
//     email: string;
//     firstName: string;
//     lastName: string;
//     countryId: number;
//     preferredLanguage: string;
// }
