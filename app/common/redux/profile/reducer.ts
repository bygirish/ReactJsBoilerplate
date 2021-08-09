// import { IProfile } from "@models/Profile";

// import { profileActions } from "./actions";

// export interface IProfileState {
//   byId: {};
//   fetchLoggedInUser: IProfile;
//   createUser: any;
//   loaders: {
//     fetchProfiles: boolean;
//     fetchLoggedInUser: boolean;
//     createUser: boolean;
//   };
//   errors: {
//     fetchProfiles: string;
//     fetchLoggedInUser: string;
//     createUser: string;
//   };
// }

// export const initialState: IProfileState = {
//   byId: {},
//   fetchLoggedInUser: {} as IProfile,
//   createUser: {},
//   loaders: {
//     fetchProfiles: false,
//     fetchLoggedInUser: false,
//     createUser: false,
//   },
//   errors: {
//     fetchProfiles: "",
//     fetchLoggedInUser: "",
//     createUser: "",
//   },
// };

// export const profileReducer = (
//   state: IProfileState = initialState,
//   action: { type: string; payload: any }
// ) => {
//   switch (action.type) {
//     case profileActions.FETCH_PROFILES_BY_USER_IDS:
//       return {
//         ...state,
//         loaders: { ...state.loaders, fetchProfiles: true },
//         errors: { ...state.errors, fetchProfiles: "" },
//       };
//     case profileActions.FETCH_PROFILES_BY_USER_IDS_SUCCESS:
//       let profiles = action.payload.profiles;
//       updateProfileMap(profiles, state.byId);
//       return {
//         ...state,
//         loaders: { ...state.loaders, fetchProfiles: false },
//       };
//     case profileActions.FETCH_PROFILES_BY_USER_IDS_FAIL:
//       return {
//         ...state,
//         loaders: { ...state.loaders, fetchProfiles: false },
//         errors: { ...state.errors, fetchProfiles: action.payload },
//       };

//        // fetching the logged in user details.
//     case profileActions.FETCH_PROFILE_DETAILS:
//       return {
//         ...state,
//         loaders: { ...state.loaders, fetchLoggedInUser: true },
//         errors: { ...state.errors, fetchLoggedInUser: "" },
//       };
//     case profileActions.FETCH_PROFILE_DETAILS_SUCCESS:
//       return {
//         ...state,
//         fetchLoggedInUser: action.payload,
//         loaders: { ...state.loaders, fetchLoggedInUser: false },
//       };
//     case profileActions.FETCH_PROFILE_DETAILS_FAIL:
//       return {
//         ...state,
//         loaders: { ...state.loaders, fetchLoggedInUser: false },
//         errors: { ...state.errors, fetchLoggedInUser: action.payload },
//       };

//      // Register New User
//     case profileActions.CREATE_PROFILE:
//       return {
//         ...state,
//         loaders: { ...state.loaders, createUser: true },
//         errors: { ...state.errors, createUser: "" },
//       };
//     case profileActions.CREATE_PROFILE_SUCCESS:
//       return {
//         ...state,
//         createUser: action.payload,
//         loaders: { ...state.loaders, createUser: false },
//       };
//     case profileActions.CREATE_PROFILE_FAIL:
//       return {
//         ...state,
//         loaders: { ...state.loaders, createUser: false },
//         errors: { ...state.errors, createUser: action.payload },
//       };
//     default:
//       return state;
//   }
// };

// export const updateProfileMap = (newProfiles: IProfile[], existingMap: any) => {
//   newProfiles.forEach((profile) => {
//     existingMap[profile.userId] = profile.id;
//     existingMap[profile.id] = profile;
//   });
// };
