// import { ICreateProfilePayload } from "@redux/auth/interface";

// import { IProfile, ProfileModel } from "@models/Profile";

// const actionTypePrefix = "PROFILE";

// export const profileActions = {
//   FETCH_PROFILES_BY_USER_IDS: `${actionTypePrefix}/FETCH_PROFILES_BY_USER_IDS`,
//   FETCH_PROFILES_BY_USER_IDS_SUCCESS: `${actionTypePrefix}/FETCH_PROFILES_BY_USER_IDS_SUCCESS`,
//   FETCH_PROFILES_BY_USER_IDS_FAIL: `${actionTypePrefix}/FETCH_PROFILES_BY_USER_IDS_FAIL`,

//   CREATE_PROFILE: `${actionTypePrefix}/CREATE_PROFILE`,
//   CREATE_PROFILE_SUCCESS: `${actionTypePrefix}/CREATE_PROFILE_SUCCESS`,
//   CREATE_PROFILE_FAIL: `${actionTypePrefix}/CREATE_PROFILE_FAIL`,

//   FETCH_PROFILE_DETAILS: `${actionTypePrefix}/FETCH_PROFILE_DETAILS`,
//   FETCH_PROFILE_DETAILS_SUCCESS: `${actionTypePrefix}/FETCH_PROFILE_DETAILS_SUCCESS`,
//   FETCH_PROFILE_DETAILS_FAIL: `${actionTypePrefix}/FETCH_PROFILE_DETAILS_FAIL`,
// };

// export interface IFetchProfilesByUserIdsAction {
//   type: string;
//   payload: {
//     userIds: string[];
//   };
// }

// export interface IFetchProfileDetailsAction {
//   type: string;
//   payload: {
//     userId: string;
//   }
// }

// export const fetchProfilesByUserIds = (
//   userIds: string[]
// ): IFetchProfilesByUserIdsAction => {
//   return {
//     type: profileActions.FETCH_PROFILES_BY_USER_IDS,
//     payload: {
//       userIds,
//     },
//   };
// };

// export const fetchProfilesByUserIdsSuccess = (profiles: IProfile[]) => {
//   return {
//     type: profileActions.FETCH_PROFILES_BY_USER_IDS_SUCCESS,
//     payload: {
//       profiles,
//     },
//   };
// };

// export const fetchProfilesByUserIdsFailure = (error: string) => {
//   return {
//     type: profileActions.FETCH_PROFILES_BY_USER_IDS_FAIL,
//     payload: error,
//   };
// };

// export const fetchProfileDetails = (userId: string): IFetchProfileDetailsAction => {
//   return {
//     type: profileActions.FETCH_PROFILE_DETAILS,
//     payload: {
//       userId
//     },
//   }
// }

// export const fetchProfileDetailsSuccess = (profile: ProfileModel) => {
//   return {
//     type: profileActions.FETCH_PROFILE_DETAILS_SUCCESS,
//     payload: profile,
//   }
// }

// export const fetchProfileDetailsFail = (error: string) => {
//   return {
//     type: profileActions.FETCH_PROFILE_DETAILS_FAIL,
//     payload: error,
//   }
// }

// // Create Profile
// export const createProfile = (payload: ICreateProfilePayload) => {
//   return {
//     type: profileActions.CREATE_PROFILE,
//     payload,
//   }
// }

// export const createProfileSuccess = (profile: any) => {
//   return {
//     type: profileActions.CREATE_PROFILE_SUCCESS,
//     payload: profile,
//   }
// }

// export const createProfileFail = (error: string) => {
//   return {
//     type: profileActions.CREATE_PROFILE_FAIL,
//     payload: error,
//   }
// }

