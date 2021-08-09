// import { authActions } from '@redux/auth/actions';

// import { IAuthState } from './interface';

// export const initialState = {
//     isWebView: false,
//     login: {},
//     changePassword: false,
//     forgotPassword: null,
//     checkUserExist: null,
//     register: null,
//     resendVerifyMail: null,
//     isAuthenticated: false,
//     loaders: {
//         login: false,
//         checkUserExist: false,
//         register: false,
//         resendVerifyMail: false,
//         forgotPassword: false,
//         changePassword: false,
//     },
//     errors: {
//         login: '',
//         checkUserExist: '',
//         register: '',
//         resendVerifyMail: '',
//         forgotPassword: '',
//         changePassword: '',
//     }
// };

// export const authReducer = (state: IAuthState = initialState,
//     action: { type: string; payload: any }) => {
//     switch (action.type) {

//     case authActions.SET_WEBVIEW: 
//     return {  
//         ...state,
//         isWebView: true,
//     };
//     case authActions.LOGIN:
//         return {
//             ...state,
//             loaders: { ...state.loaders, login: true },
//             errors: { ...state.loaders, login: '' },
//         };
//     case authActions.LOGIN_SUCCESS:
//         return {
//             ...state,
//             login: action.payload,
//             loaders: { ...state.loaders, login: false },
//         };
//     case authActions.LOGIN_FAIL:
//         return {
//             ...state,
//             loaders: { ...state.loaders, login: false },
//             errors: { ...state.errors, login: action.payload },
//         };

//     case authActions.CHECK_USER_EXIST:
//         return {
//             ...state,
//             loaders: { ...state.loaders, checkUserExist: true },
//             errors: { ...state.loaders, checkUserExist: '' },
//         };
//     case authActions.CHECK_USER_EXIST_SUCCESS:
//         return {
//             ...state,
//             checkUserExist: action.payload,
//             loaders: { ...state.loaders, checkUserExist: false },
//         };
//     case authActions.CHECK_USER_EXIST_FAIL:
//         return {
//             ...state,
//             loaders: { ...state.loaders, checkUserExist: false },
//             errors: { ...state.errors, checkUserExist: action.payload },
//         };

//     case authActions.REGISTER:
//         return {
//             ...state,
//             loaders: { ...state.loaders, register: true },
//             errors: { ...state.loaders, register: '' },
//         };
//     case authActions.REGISTER_SUCCESS:
//         return {
//             ...state,
//             register: action.payload,
//             loaders: { ...state.loaders, register: false },
//         };
//     case authActions.REGISTER_FAIL:
//         return {
//             ...state,
//             loaders: { ...state.loaders, register: false },
//             errors: { ...state.errors, register: action.payload },
//         };

//     case authActions.RESEND_VERIFY_MAIL:
//         return {
//             ...state,
//             loaders: { ...state.loaders, resendVerifyMail: true },
//             errors: { ...state.loaders, resendVerifyMail: '' },
//         };
//     case authActions.RESEND_VERIFY_MAIL_SUCCESS:
//         return {
//             ...state,
//             resendVerifyMail: action.payload,
//             loaders: { ...state.loaders, resendVerifyMail: false },
//         };
//     case authActions.RESEND_VERIFY_MAIL_FAIL:
//         return {
//             ...state,
//             loaders: { ...state.loaders, resendVerifyMail: false },
//             errors: { ...state.errors, resendVerifyMail: action.payload },
//         };

//     case authActions.FORGOT_PASSWORD:
//         return {
//             ...state,
//             loaders: { ...state.loaders, forgotPassword: true },
//             errors: { ...state.loaders, forgotPassword: '' },
//         };
//     case authActions.FORGOT_PASSWORD_SUCCESS:
//         return {
//             ...state,
//             forgotPassword: action.payload,
//             loaders: { ...state.loaders, forgotPassword: false },
//         };
//     case authActions.FORGOT_PASSWORD_FAIL:
//         return {
//             ...state,
//             loaders: { ...state.loaders, forgotPassword: false },
//             errors: { ...state.errors, forgotPassword: action.payload },
//         };

//     case authActions.CHANGE_PASSWORD:
//         return {
//             ...state,
//             loaders: { ...state.loaders, changePassword: true },
//             errors: { ...state.loaders, changePassword: '' },
//         };
//     case authActions.CHANGE_PASSWORD_SUCCESS:
//         return {
//             ...state,
//             changePassword: action.payload,
//             loaders: { ...state.loaders, changePassword: false },
//         };
//     case authActions.CHANGE_PASSWORD_FAIL:
//         return {
//             ...state,
//             loaders: { ...state.loaders, changePassword: false },
//             errors: { ...state.errors, changePassword: action.payload },
//         };

//     case authActions.SET_AUTHENTICATED_FLAG:
//         return {
//             ...state,
//             isAuthenticated: action.payload,
//         };

//     case authActions.LOGOUT:
//         return {
//             ...state,
//             isAuthenticated: true,
//             isLoggedIn: true,
//             loaders: {
//                 ...state.loaders,
//                 logout: true,
//             },
//         };

//     case authActions.LOGOUT_SUCCESS:
//         return {
//             ...state,
//             error: {},
//             isAuthenticated: false,
//             isLoggedIn: false,
//             loaders: {
//                 ...state.loaders,
//                 logout: false,
//             },
//         };

//     case authActions.LOGOUT_FAIL:
//         return {
//             ...state,
//             error: {},
//             loaders: {
//                 ...state.loaders,
//                 logout: false,
//             },
//         };
//     default:
//         return state;
//     }
// };
