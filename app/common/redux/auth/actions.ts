// import { IFluxStandardAction } from "@store/webInterfaces";
// import { ILoginPayload, ICheckUserExist, IForgotPassword, IResendVerifyMail } from "@redux/auth/interface";
// // import { LoginModel } from "@common/domain/models/Login";
// import { authReducer } from "./reducer";

// const actionTypePrefix = "AUTH";

// export const authActions = {
//     LOGIN: `${actionTypePrefix}/LOGIN`,
//     LOGIN_SUCCESS: `${actionTypePrefix}/LOGIN_SUCCESS`,
//     LOGIN_FAIL: `${actionTypePrefix}/LOGIN_FAIL`,

//     CHECK_USER_EXIST: `${actionTypePrefix}/CHECK_USER_EXIST`,
//     CHECK_USER_EXIST_SUCCESS: `${actionTypePrefix}/CHECK_USER_EXIST_SUCCESS`,
//     CHECK_USER_EXIST_FAIL: `${actionTypePrefix}/CHECK_USER_EXIST_FAIL`,

//     LOGOUT: `${actionTypePrefix}/LOGOUT`,
//     LOGOUT_SUCCESS: `${actionTypePrefix}/LOGOUT_SUCCESS`,
//     LOGOUT_FAIL: `${actionTypePrefix}/LOGOUT_FAIL`,
//     SET_AUTHENTICATED_FLAG: `${actionTypePrefix}/SET_AUTHENTICATED_FLAG`,

//     REGISTER: `${actionTypePrefix}/REGISTER`,
//     REGISTER_SUCCESS: `${actionTypePrefix}/REGISTER_SUCCESS`,
//     REGISTER_FAIL: `${actionTypePrefix}/REGISTER_FAIL`,

//     RESEND_VERIFY_MAIL: `${actionTypePrefix}/RESEND_VERIFY_MAIL`,
//     RESEND_VERIFY_MAIL_SUCCESS: `${actionTypePrefix}/RESEND_VERIFY_MAIL_SUCCESS`,
//     RESEND_VERIFY_MAIL_FAIL: `${actionTypePrefix}/RESEND_VERIFY_MAIL_FAIL`,

//     FORGOT_PASSWORD: `${actionTypePrefix}/FORGOT_PASSWORD`,
//     FORGOT_PASSWORD_SUCCESS: `${actionTypePrefix}/FORGOT_PASSWORD_SUCCESS`,
//     FORGOT_PASSWORD_FAIL: `${actionTypePrefix}/FORGOT_PASSWORD_FAIL`,

//     CHANGE_PASSWORD: `${actionTypePrefix}/CHANGE_PASSWORD`,
//     CHANGE_PASSWORD_SUCCESS: `${actionTypePrefix}/CHANGE_PASSWORD_SUCCESS`,
//     CHANGE_PASSWORD_FAIL: `${actionTypePrefix}/CHANGE_PASSWORD_FAIL`,

//     CLEAR_USER: `${actionTypePrefix}/CLEAR_USER`,

//     SET_WEBVIEW: `${actionTypePrefix}SET_WEBVIEW`
// }

// export const setAuthenticatedFlag = (isAuthenticated: boolean): { type: string, payload: boolean } => {
//     return {
//       type: authActions.SET_AUTHENTICATED_FLAG,
//       payload: isAuthenticated,
//     };
//   };

// export const login = (payload: ILoginPayload): IFluxStandardAction<ILoginPayload> => {
//     return {
//         type: authActions.LOGIN,
//         payload
//     }
// }

// export const loginSuccess = (payload: LoginModel): IFluxStandardAction<LoginModel> => {
//     return {
//         type: authActions.LOGIN_SUCCESS,
//         payload
//     }
// }

// export const loginFail = (error: string): IFluxStandardAction<string> => {
//     return {
//         type: authActions.LOGIN_FAIL,
//         payload: error
//     }
// }

// export const checkUserExist = (payload: ICheckUserExist): IFluxStandardAction<ICheckUserExist> => {
//     return {
//         type: authActions.CHECK_USER_EXIST,
//         payload
//     }
// }

// export const checkUserExistSuccess = (payload: any): IFluxStandardAction<any> => {
//     return {
//         type: authActions.CHECK_USER_EXIST_SUCCESS,
//         payload
//     }
// }

// export const checkUserExistFail = (error: string): IFluxStandardAction<string> => {
//     return {
//         type: authActions.CHECK_USER_EXIST_FAIL,
//         payload: error
//     }
// }

// export const register = (payload: ILoginPayload): IFluxStandardAction<ILoginPayload> => {
//     return {
//         type: authActions.REGISTER,
//         payload
//     }
// }

// export const registerSuccess = (payload: {}): IFluxStandardAction<{}> => {
//     return {
//         type: authActions.REGISTER_SUCCESS,
//         payload
//     }
// }

// export const registerFail = (error: string): IFluxStandardAction<string> => {
//     return {
//         type: authActions.REGISTER_FAIL,
//         payload: error
//     }
// }

// export const forgotPassword = (payload: IForgotPassword): IFluxStandardAction<IForgotPassword> => {
//     return {
//         type: authActions.FORGOT_PASSWORD,
//         payload
//     }
// }

// export const forgotPasswordSuccess = (payload: {}): IFluxStandardAction<{}> => {
//     return {
//         type: authActions.FORGOT_PASSWORD_SUCCESS,
//         payload
//     }
// }

// export const forgotPasswordFail = (error: string): IFluxStandardAction<string> => {
//     return {
//         type: authActions.FORGOT_PASSWORD_FAIL,
//         payload: error
//     }
// }

// export const resendVerifyMail = (payload: ILoginPayload): IFluxStandardAction<ILoginPayload> => {
//     return {
//         type: authActions.RESEND_VERIFY_MAIL,
//         payload
//     }
// }

// export const resendVerifyMailSuccess = (payload: IResendVerifyMail): IFluxStandardAction<IResendVerifyMail> => {
//     return {
//         type: authActions.RESEND_VERIFY_MAIL_SUCCESS,
//         payload
//     }
// }

// export const resendVerifyMailFail = (error: string): IFluxStandardAction<string> => {
//     return {
//         type: authActions.RESEND_VERIFY_MAIL_FAIL,
//         payload: error,
//     }
// }

// export const logout = (uuid: string) => {
//   return {
//     type: authActions.LOGOUT,
//     payload: uuid,
//   };
// };

// export const logoutSuccess = (): IFluxStandardAction => {
//     return {
//         type: authActions.LOGOUT_SUCCESS,
//     }
// }

// export const logoutFailure = (error: {}): { type: string, payload: {} } => {
//     return {
//       type: authActions.LOGOUT_FAIL,
//       payload: error,
//     };
// };
  
// export const changePassword = (payload: ILoginPayload): IFluxStandardAction<ILoginPayload> => {
//     return {
//         type: authActions.CHANGE_PASSWORD,
//         payload
//     }
// }

// export const changePasswordSuccess = (): IFluxStandardAction<boolean> => {
//     return {
//         type: authActions.CHANGE_PASSWORD_SUCCESS,
//         payload: true
//     }
// }

// export const changePasswordFail = (error: string): IFluxStandardAction<string> => {
//     return {
//         type: authActions.CHANGE_PASSWORD_FAIL,
//         payload: error
//     }
// }

// export const clearUser = (): IFluxStandardAction<string> => {
//     return {
//         type: authActions.CLEAR_USER,
//     }
// }


// export const setWebView = () => {
//     return {
//       type: authActions.SET_WEBVIEW,
//     };
// }
