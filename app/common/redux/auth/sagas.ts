// import { call, ForkEffect, put, StrictEffect, takeLatest } from "redux-saga/effects";

// import { getErrorCodes } from "@utils/ErrorMessageUtils";
// import { getLocalisationData, updateLocalisationData } from "@utils/LanguageUtils";
// import { LocalStorage, StorageKeys } from "@utils/LocalStorage";
// import { Logger } from "@utils/Logger";

// import { AuthRepository } from "@repositories/AuthRepository";

// import { LoginModel } from "@common/domain/models/Login";

// import { authActions, 
//          changePasswordFail, 
//          changePasswordSuccess, 
//          checkUserExistFail, 
//          checkUserExistSuccess, 
//          forgotPasswordFail, 
//          forgotPasswordSuccess,
//          loginFail, 
//          loginSuccess, 
//          logoutFailure, 
//          logoutSuccess, 
//          registerFail, 
//          registerSuccess,
//          resendVerifyMailFail, 
//          resendVerifyMailSuccess,
//          setAuthenticatedFlag} from "@redux/auth/actions";

// import { IFluxStandardAction } from "@store/webInterfaces";
// import { ICheckUserExist, IForgotPassword, ILoginPayload, ILogoutAction, ILogoutModel } from "./interface";

// export function* loginSaga(action: IFluxStandardAction<ILoginPayload>): Generator<StrictEffect, void, LoginModel> {
//     try {
//         const loginResponse: LoginModel = yield call(AuthRepository.login, action.payload);
//         yield put(loginSuccess(loginResponse));
//         yield put(setAuthenticatedFlag(true));
//     } catch (e) {
//         yield put(setAuthenticatedFlag(false));
//         yield put(loginFail(e.message));
//     }
// }

// export function* checkUserExistSaga(action: IFluxStandardAction<ICheckUserExist>): Generator<StrictEffect, void, any> {
//     try {
//         const checkUserExistResponse: any = yield call(AuthRepository.checkUserExist, action.payload); 
//         yield put(checkUserExistSuccess(checkUserExistResponse));
//     } catch (e) {
//         yield put(checkUserExistFail(e.message));
//     }
// }

// export function* registerSaga(action: IFluxStandardAction<ILoginPayload>): Generator<StrictEffect, void, any> {
//     try {
//         const registerResponse: any = yield call(AuthRepository.register, action.payload); 
//         yield put(registerSuccess(registerResponse));
//         yield put(setAuthenticatedFlag(true));
//     } catch (e) {
//         yield put(setAuthenticatedFlag(false));
//         const error = getErrorCodes(e);
//         yield put(registerFail(error));
//     }
// }

// export function* resendVerifyMailSaga(action: IFluxStandardAction<ILoginPayload>): Generator<StrictEffect, void, any> {
//     try {
//         const resendVerifyMailResponse: any = yield call(AuthRepository.resendVerifyMail, action.payload);
//         yield put(resendVerifyMailSuccess(resendVerifyMailResponse));
//     } catch (e) {
//         const error = getErrorCodes(e);
//         yield put(resendVerifyMailFail(error));
//     }
// }

// export function* forgotPasswordSaga(action: IFluxStandardAction<IForgotPassword>): Generator<StrictEffect, void, {}> {
//     try {
//         const forgotPasswordResponse = yield call(AuthRepository.forgotPassword, action.payload); 
//         yield put(forgotPasswordSuccess(forgotPasswordResponse));
//     } catch (e) {
//         const error = getErrorCodes(e);
//         yield put(forgotPasswordFail(error));
//     }
// }

// export function* changePassword(action: IFluxStandardAction<ILoginPayload>): Generator<StrictEffect, void, any> {
//     try {
//         yield call(AuthRepository.changePassword, action.payload); 
//         yield put(changePasswordSuccess());
//     } catch (e) {
//         const error = getErrorCodes(e);
//         yield put(changePasswordFail(error));
//     }
// }

// export async function removeUserData() {
//     const localisationData = await getLocalisationData();
//     let guestLangId: any = await LocalStorage.get(
//         StorageKeys.GUEST_USER_LANG,
//     );
//     // if not found set default lang
//     if(!guestLangId) {
//       guestLangId = { id: 1, code: 'en' };
//     }
//     await LocalStorage.clearAll();
//     await LocalStorage.set(StorageKeys.GUEST_USER_LANG, guestLangId);
//     await updateLocalisationData(localisationData);
//   }
  
// export function* logoutJob(logoutAction: ILogoutAction): any {
//     try {
//       if(logoutAction.payload){
//         const deviceInfo: ILogoutModel = {device: {installationId: logoutAction.payload}} as ILogoutModel;
//         yield call(AuthRepository.logout, deviceInfo);
//       }
//     //   yield call(AuthRepository.deleteAuthToken);
//       yield call(removeUserData);
//       yield put(logoutSuccess());
//     } catch (e) {
//       Logger.warn('User logout failed', { error: e });
//       yield put(logoutFailure({message: e.message}));
//     }
//   }

// export function* watchAuth(): Generator<ForkEffect> {
//     yield takeLatest(authActions.LOGIN, loginSaga);
//     yield takeLatest(authActions.CHECK_USER_EXIST, checkUserExistSaga);
//     yield takeLatest(authActions.REGISTER, registerSaga);
//     yield takeLatest(authActions.RESEND_VERIFY_MAIL, resendVerifyMailSaga);
//     yield takeLatest(authActions.FORGOT_PASSWORD, forgotPasswordSaga);
//     yield takeLatest(authActions.CHANGE_PASSWORD, changePassword);
//     yield takeLatest(authActions.LOGOUT, logoutJob);
// }
