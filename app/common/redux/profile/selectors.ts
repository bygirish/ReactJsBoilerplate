// import { IProfile } from "@models/Profile";

// const isProfileStateUndefined = (state: any) => state.profile === undefined;

// const isProfileErrorsUndefined = (state: any) =>
//   state.profile.errors === undefined;

// const isProfileLoaderUndefined = (state: any) =>
//   state.profile.loaders === undefined;

// export const getProfileMap = (state: any) => {
//   if (isProfileStateUndefined(state) || !state.profile.byId) return null;

//   return state.profile.byId;
// };

// export const getProfileByIdSelector = (
//   state: any,
//   profileId: string
// ): IProfile | null => {
//   if (isProfileStateUndefined(state) || !state.profile.byId) return null;

//   return state.profile.byId[profileId];
// };

// export const getProfileByUserIdSelector = (
//   state: any,
//   userId: string
// ): IProfile | null => {
//   if (isProfileStateUndefined(state) || !state.profile.byId) return null;

//   return getProfileByIdSelector(state, state.profile.byId[userId]);
// };

// export const getFetchProfileLoaderSelector = (state: any) => {
//   if (
//     isProfileStateUndefined(state) ||
//     isProfileLoaderUndefined(state) ||
//     !state.profile.loaders.fetchProfiles
//   )
//     return false;
//   return state.profile.loaders.fetchProfiles;
// };

// export const getFetchProfileErrorSelector = (state: any) => {
//   if (
//     isProfileStateUndefined(state) ||
//     isProfileErrorsUndefined(state) ||
//     !state.profile.errors.fetchProfiles
//   )
//     return false;
//   return state.profile.errors.fetchProfiles;
// };

// export const fetchProfileUserDetailsSelector = (state: any): IProfile => {
//   if (isProfileStateUndefined(state) ||
//       isProfileErrorsUndefined(state) ||
//       !state.profile.fetchLoggedInUser
//     )
//     return {} as IProfile;
//   return state.profile.fetchLoggedInUser;
// }

// export const fetchProfileUserDetailsErrorSelector = (state: any): string => {
//   if (isProfileStateUndefined(state) ||
//       isProfileErrorsUndefined(state) ||
//       !state.profile.errors.fetchLoggedInUser
//     )
//     return '';
//   return state.profile.errors.fetchLoggedInUser;
// }

// export const fetchProfileUserDetailsLoaderSelector = (state: any): boolean => {
//   if (
//     isProfileStateUndefined(state) ||
//     isProfileLoaderUndefined(state) ||
//     !state.profile.loaders.fetchLoggedInUser
//   )
//     return false;
//   return state.profile.loaders.fetchLoggedInUser;
// };

// // Register User
// export const createProfileSelector = (state: any) => {
//   if (isProfileStateUndefined(state) ||
//       isProfileErrorsUndefined(state) ||
//       !state.profile.createUser
//     )
//     return null;
//   return state.profile.createUser;
// }

// export const createProfileErrorSelector = (state: any): string => {
//   if (isProfileStateUndefined(state) ||
//       isProfileErrorsUndefined(state) ||
//       !state.profile.errors.createUser
//     )
//     return '';
//   return state.profile.errors.createUser;
// }

// export const createProfileLoaderSelector = (state: any): boolean => {
//   if (
//     isProfileStateUndefined(state) ||
//     isProfileLoaderUndefined(state) ||
//     !state.profile.loaders.createUser
//   )
//     return false;
//   return state.profile.loaders.createUser;
// };
