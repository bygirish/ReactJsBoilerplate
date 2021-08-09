// /**
//  * Commented below code as we are not yet supporting mutlilang
//  */
// import { WebStoreProviderService } from '@store/WebStoreProviderService';
// import { Logger } from '@utils/Logger';
// import { LocalStorage, StorageKeys } from '@utils/LocalStorage';
// import { i18n } from './i18n';

// export enum AppLanguage {
//   English = 'en',
//   Hindi = 'hi',
// }

// const store = WebStoreProviderService.getStore();

// // Get the isAuthenticated from store
// const isAuthenticated = () => true;

// export const guestUserLangCode = async () => {
//   const guestLang: {
//     id: string | number;
//     code: string;
//   } = await LocalStorage.get(StorageKeys.GUEST_USER_LANG);
//   return guestLang !== null && !guestLang ? guestLang.code : 'en';
// };

// export const getUserSettingsFromLocalStorage = async () => {
//   const userSettings: any = await LocalStorage.get(StorageKeys.USER_SETTINGS);
//   return (!!userSettings) ? userSettings : undefined;
// }

// export const userPrimeLangCode = () => {
//   const isLoggedIn = isAuthenticated();
//   if (isLoggedIn) {
//     // const primaryLang = getFromStore();
//     const primaryLang = { languageCode: 'en' };
//     Logger.info('[AppLanguage - userPrimeLangCode]', { primaryLang });
//     return primaryLang ? primaryLang.languageCode : '';
//   }
// };

// export const getLangPath = (actualRoute: string) => {
//   const lang = i18n.language;
//   const langCode = lang ? lang : 'en';
//   return `/${langCode}${actualRoute}`;
// };
