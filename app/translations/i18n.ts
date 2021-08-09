import i18next, { i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import hi from './jsons/hi.json';
import en from './jsons/en.json';
import { Logger } from '@utils/Logger';

const resources = {
  en: {
    advantage: en,
  },
  hi: {
    advantage: hi,
  },
};

const detectionOptions = {
  // order and from where user language should be detected
  order: ['path', 'subdomain', 'querystring', 'navigator', 'htmlTag'],

  lookupQuerystring: 'lng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  // only detect languages that are in the whitelist
  checkWhitelist: true,
};

const i18nOptions = {
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  whitelist: ['en', 'hi'],
  debug: true,
  defaultNS: 'advantage',
  contextSeparator: '-',
  pluralSeparator: '-',
  returnObjects: true,
  interpolation: {
    escapeValue: false,
  },
  resources,
  detection: detectionOptions,
  react: {
    bindI18n: 'languageChanged',
    bindI18nStore: '',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    useSuspense: true,
  },
};

class I18nInstance {
  private i18n: any;

  private async init() {
    Logger.info('[I18nInstance - init()] Creating i18n new instance');
    this.i18n = i18next.createInstance();
    this.i18n.use(LanguageDetector);
    this.i18n.use(initReactI18next);
    await this.i18n.init(i18nOptions, (err: any, t: any) => {
      if (err) {
        Logger.error(
          '[I18nInstance - init()]',
          { error: 'unable to init i18n instance. err:' + err },
        );
      }
      Logger.info(
        '[I18nInstance - init()]',
        { info: 'instance created successfully. Test:' + t('labelsAndTitles.HOME')},
      );
    });
  }

  public getI18n() {
    if (!this.i18n) {
      this.init();
    }
    return this.i18n;
  }
}

const i18nSingleton = new I18nInstance();
const advantagei18n = i18nSingleton.getI18n();
export { advantagei18n as i18n };
