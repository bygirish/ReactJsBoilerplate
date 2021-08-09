// import { call, ForkEffect, put, takeLatest } from "redux-saga/effects";

// import { getErrorCodes } from "@utils/ErrorMessageUtils";

// import { IProfile, ProfileModel } from "@common/domain/models/Profile";
// import { ProfileRepository } from "@common/domain/repositories/ProfileRepository";

// import {
//   createProfileFail,
//   createProfileSuccess,
//   fetchProfileDetailsFail,
//   fetchProfileDetailsSuccess,
//   fetchProfilesByUserIdsFailure,
//   fetchProfilesByUserIdsSuccess,
//   IFetchProfileDetailsAction,
//   IFetchProfilesByUserIdsAction,
//   profileActions,
// } from "./actions";

// export function* fetchProfilesByUserIdsSaga(
//   action: IFetchProfilesByUserIdsAction
// ): any {
//   try {
//     const { userIds } = action.payload;
//     const response = yield call(
//       ProfileRepository.fetchProfilesByUserIds,
//       userIds
//     );
//     const profiles: IProfile[] = response.profile;

//     yield put(fetchProfilesByUserIdsSuccess(profiles));
//   } catch (error) {
//     yield put(fetchProfilesByUserIdsFailure(error.message));
//   }
// }

// export function* fetchProfileUserDetailsSaga(action: IFetchProfileDetailsAction): any { // TODO: Figure out return type.
//   try {
//     const { userId } = action.payload;
//     const response = yield call(ProfileRepository.fetchProfilesByUserIds, [userId]);
//     const profiles: ProfileModel = response.profile[0];
//     yield put(fetchProfileDetailsSuccess(profiles));
//   } catch (e) {
//     const error = getErrorCodes(e);
//     yield put(fetchProfileDetailsFail(error));
//   }
// }

// export function* createProfileSaga(action: any): any {
//   try {
//     const response = yield call(ProfileRepository.createProfile, action.payload);
//     yield put(createProfileSuccess(response));
//   } catch (e) {
//     const error = getErrorCodes(e);
//     yield put(createProfileFail(error));
//   }
// }

// export function* watchProfiles(): Generator<ForkEffect> {
//   yield takeLatest(profileActions.FETCH_PROFILES_BY_USER_IDS,fetchProfilesByUserIdsSaga);
//   yield takeLatest(profileActions.FETCH_PROFILE_DETAILS, fetchProfileUserDetailsSaga);
//   yield takeLatest(profileActions.CREATE_PROFILE, createProfileSaga);

// }
