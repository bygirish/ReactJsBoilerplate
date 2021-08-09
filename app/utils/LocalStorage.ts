import AsyncStorage from '@callstack/async-storage';

export const StorageKeys = {
  USER: '@user',
  TOKEN: '@token',
  PASSWORD_RESET: '@passwordReset',
  IS_PRIVACY_POLICY_ACCEPTED: '@isPrivacyPolicyAccepted',
  USER_ID: '@user:id',
  USER_UUID: '@uuid',
  FCM_TOKEN: '@FCMtoken',
  PROFILE_ID: '@profileId',
  HAS_DEEP_LINKS: '@hasDeepLinks',
  USER_ECOSYSTEM_ID: '@userEcosystemId',
  USER_SETTINGS: '@userSettings',
  IS_VERIFIED: '@isVerified',
  GUEST_USER_LANG: '@guestUserLangId',
  LOCALIZATION_ETAG: '@localizationETag',
  LOCALISATION_JSON: '@jsonFile',
  EMAIL: '@email',

  USER_ROLE: '@role',
  USER_NAME: '@userName',

  // moved form localStorageConstants.js
  ACCESS_TOKEN: '@accessToken',
  REFRESH_TOKEN: '@refreshToken',
  IS_PROFILE_COMPLETED: '@isProfileCompleted',
  IS_EMAIL_VERIFIED: '@isEmailVerified',
  TEMP_PASS_GENERATED: '@tempPasswordGenerated',
  PREFERRED_LANGUAGE: '@preferredLanguage',

  IS_WEBVIEW: '@isWebView',
};

async function set<T>(key: string, data: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

async function get<T>(key: string): Promise<T | null> {
  const value: string | null = await AsyncStorage.getItem(key);
  if (!value) {
    return null;
  }
  const data: T = JSON.parse(JSON.stringify(value)) as T;
  return data;
}

async function clear<T>(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

async function clearAll<T>(): Promise<void> {
  await AsyncStorage.clear();
}


export const LocalStorage = {
  get,
  set,
  clear,
  clearAll,
};
