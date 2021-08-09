// import { LoginModel } from "@common/domain/models/Login";
// import { IState } from "@store/webInterfaces";

// const isAuthStateUndefined = (state: IState) => state.auth === undefined;

// const isAuthErrorsUndefined = (state: IState) => state.auth.errors === undefined;

// const isAuthLoaderUndefined = (state: IState) => state.auth.loaders === undefined;

// export const loginSelector = (state: IState): LoginModel => {
//     if(isAuthStateUndefined(state) || !state.auth.login)
//         return null;
//     return state.auth.login as LoginModel;
// }

// export const loginLoaderSelector = (state: IState): boolean => {
//     if(isAuthStateUndefined(state) || isAuthLoaderUndefined(state) || !state.auth.loaders.login)
//         return null;
//     return state.auth.loaders.login;
// }

// export const loginErrorSelector = (state: IState): string => {
//     if(isAuthStateUndefined(state) || isAuthErrorsUndefined(state) || !state.auth.errors.login)
//         return null;
//     return state.auth.errors.login;
// }

// export const checkUserExistSelector = (state: IState): any => {
//     if(isAuthStateUndefined(state) || !state.auth.checkUserExist)
//         return null;
//     return state.auth.checkUserExist;
// }

// export const checkUserExistLoaderSelector = (state: IState): boolean => {
//     if(isAuthStateUndefined(state) || isAuthLoaderUndefined(state) || !state.auth.loaders.checkUserExist)
//         return null;
//     return state.auth.loaders.checkUserExist;
// }

// export const checkUserExistErrorSelector = (state: IState): string => {
//     if(isAuthStateUndefined(state) || isAuthErrorsUndefined(state) || !state.auth.errors.checkUserExist)
//         return null;
//     return state.auth.errors.checkUserExist;
// }

// export const registerSelector = (state: IState): any => {
//     if(isAuthStateUndefined(state) || !state.auth.register)
//         return null;
//     return state.auth.register;
// }

// export const registerLoaderSelector = (state: IState): boolean => {
//     if(isAuthStateUndefined(state) || isAuthLoaderUndefined(state) || !state.auth.loaders.register)
//         return null;
//     return state.auth.loaders.register;
// }

// export const registerErrorSelector = (state: IState): string => {
//     if(isAuthStateUndefined(state) || isAuthErrorsUndefined(state) || !state.auth.errors.register)
//         return '';
//     return state.auth.errors.register;
// }

// export const resendVerifyMailSelector = (state: IState): any => {
//     if(isAuthStateUndefined(state) || !state.auth.resendVerifyMail)
//         return null;
//     return state.auth.resendVerifyMail;
// }

// export const resendVerifyMailLoaderSelector = (state: IState): boolean => {
//     if(isAuthStateUndefined(state) || isAuthLoaderUndefined(state) || !state.auth.loaders.resendVerifyMail)
//         return null;
//     return state.auth.loaders.resendVerifyMail;
// }

// export const resendVerifyMailErrorSelector = (state: IState): string => {
//     if(isAuthStateUndefined(state) || isAuthErrorsUndefined(state) || !state.auth.errors.resendVerifyMail)
//         return '';
//     return state.auth.errors.resendVerifyMail;
// }

// export const forgotPasswordSelector = (state: IState): any => {
//     if(isAuthStateUndefined(state) || !state.auth.forgotPassword)
//         return null;
//     return state.auth.forgotPassword;
// }

// export const forgotPasswordLoaderSelector = (state: IState): boolean => {
//     if(isAuthStateUndefined(state) || isAuthLoaderUndefined(state) || !state.auth.loaders.forgotPassword)
//         return false;
//     return state.auth.loaders.forgotPassword;
// }

// export const forgotPasswordErrorSelector = (state: IState): string => {
//     if(isAuthStateUndefined(state) || isAuthErrorsUndefined(state) || !state.auth.errors.forgotPassword)
//         return '';
//     return state.auth.errors.forgotPassword;
// }

// export const changePasswordSelector = (state: IState): any => {
//     if(isAuthStateUndefined(state) || !state.auth.changePassword)
//         return null;
//     return state.auth.changePassword;
// }

// export const changePasswordLoaderSelector = (state: IState): boolean => {
//     if(isAuthStateUndefined(state) || isAuthLoaderUndefined(state) || !state.auth.loaders.changePassword)
//         return false;
//     return state.auth.loaders.changePassword;
// }

// export const changePasswordErrorSelector = (state: IState): string => {
//     if(isAuthStateUndefined(state) || isAuthErrorsUndefined(state) || !state.auth.errors.changePassword)
//         return '';
//     return state.auth.errors.changePassword;
// }

// export const isAuthenticatedSelector = (state: any): boolean => {
//     if ( state.auth === undefined || state.auth.isAuthenticated === undefined ) {
//       return false;
//     }
//     return state.auth.isAuthenticated;
// };

// export const isWebView = (state: any): boolean => {
//     if ( state.auth === undefined || state.auth.isWebView === undefined ) {
//       return false;
//     }
//     return state.auth.isWebView;
// };


