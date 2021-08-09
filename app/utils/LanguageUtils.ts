import { i18n } from '@translations/i18n';
import { LocalStorage, StorageKeys } from './LocalStorage';

export const getLanguage = () => {
  const lng = i18n.language;
  return lng || 'en';
};

export const addI18Resource = (
  key: string,
  namespace: string,
  json: object,
  deep: boolean,
) => {
  i18n.addResourceBundle(key, namespace, json, deep);
};

export const getLocalisationData = async () => {
  const etag: string = await LocalStorage.get(StorageKeys.LOCALIZATION_ETAG);
  const json: any = await LocalStorage.get(StorageKeys.LOCALISATION_JSON);
  return { etag, json };
};

export const updateLocalisationData = async (localisationData: {
  etag: string;
  json: any;
}) => {
  await LocalStorage.set(StorageKeys.LOCALIZATION_ETAG, localisationData.etag);
  await LocalStorage.set(StorageKeys.LOCALISATION_JSON, localisationData.json);
};
