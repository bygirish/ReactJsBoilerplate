// import { getLocalStorageItem } from "@utils/storagelocal.js";
// import { decodeBase64URLToken } from "@utils/helper.js";
// import { StorageKeys } from "@utils/LocalStorage.ts";
// import Navigator from '@navigator/index';
// import { NavigationUrl, URLs } from '@navigator/NavigationUrl';
// import { IUserModel } from '@models/Login';
// import { userRoles } from '@constants/config';

// export const getLoggedInUserId = () => {
//     const token = getLocalStorageItem(StorageKeys.ACCESS_TOKEN);
//     let userId = undefined;
//     if (!!token) {
//       const userIdSub = decodeBase64URLToken(token);
//       userId = userIdSub.sub;
//     }

//     return userId;
// }

// export const getUserUuid = () => {
//   return getLocalStorageItem(StorageKeys.USER_UUID);
// }

// export const getUserRole = () => {
//   const role = localStorage.getItem(StorageKeys.USER_ROLE);
//   return role;
// }


// export const setUserRole = (user) => {
//   const role = user.profile && user.profile.role && user.profile.role[0];
//   if (role) {
//     localStorage.setItem(StorageKeys.USER_ROLE, role);
//   }
// };

// export const storeUserData = (loginData, email) => {
//     const { preferences } = loginData;
//     localStorage.setItem(StorageKeys.ACCESS_TOKEN, loginData.accessToken);
//     localStorage.setItem(StorageKeys.REFRESH_TOKEN, loginData.refreshToken);
//     localStorage.setItem(StorageKeys.IS_PROFILE_COMPLETED, preferences.isProfileCompleted);
//     localStorage.setItem(StorageKeys.IS_EMAIL_VERIFIED, preferences.isEmailVerified);
//     localStorage.setItem(StorageKeys.PREFERRED_LANGUAGE, preferences.preferredLanguage);
//     localStorage.setItem(StorageKeys.USER_ROLE, ((loginData.role && loginData.role[0]) || loginData.role) as string);
//     localStorage.setItem(StorageKeys.TEMP_PASS_GENERATED, preferences.tempPasswordGenerated);
//     localStorage.setItem(StorageKeys.EMAIL, email);
//     localStorage.setItem(StorageKeys.USER, JSON.stringify(loginData));
// };

// export const handleAuthFlow = (enrollCohort?: boolean) => {
//     const user: IUserModel = getUserModal();
//     if(!user || !user.preferences) {
//         // if no data
//         return;
//     }
//     const { isProfileCompleted, tempPasswordGenerated } = user.preferences;

//     if (isProfileCompleted === 'false') {
//         Navigator.push(NavigationUrl.generate(URLs.createProfile));
//     } else if(tempPasswordGenerated === 'true') {
//         Navigator.push(NavigationUrl.generate(URLs.changePassword));
//     } else if(enrollCohort) {
//         Navigator.push(NavigationUrl.generate(URLs.enrollCohort));
//     } else {
//         Navigator.replace(NavigationUrl.generate(URLs.default));
//     }
// }

// export const updateTempPasswordFlag = (value: string) => {
//     localStorage.setItem(StorageKeys.TEMP_PASS_GENERATED, value);
//     const user = getUserModal();
//     if(user) {
//         user.preferences.tempPasswordGenerated = value;
//         updateUserModal(user);
//     }
// };

// export const getUserModal = () => {
//     const user = localStorage.getItem(StorageKeys.USER);
//     if(user) {
//         return JSON.parse(user);
//     }
//     return null;
// }

// export const updateUserModal = (user: IUserModel) => {
//     localStorage.setItem(StorageKeys.USER, JSON.stringify(user));
// }

// export const getUserEmail = () => {
//     return localStorage.getItem(StorageKeys.EMAIL);
// };


// export const updateProfileCompletedFlag = (value: string) => {
//     localStorage.setItem(StorageKeys.IS_PROFILE_COMPLETED, value);
//     // update role to student
//     localStorage.setItem(StorageKeys.USER_ROLE, userRoles.student);

//     const user = getUserModal();
//     if(user) {
//         user.preferences.isProfileCompleted = value;
//         updateUserModal(user);
//     }
// }

