// import { getLangPath } from '@translations/AppLanguage';
import { Routes } from '@navigator/Routes';

export enum URLs {
  // Default
  default = 'default',

  // Auth
  home = 'home',
  login = 'login',
  forgotPassword = 'forgotPassword',
  createProfile = 'createProfile',
  register = 'register',
  changePassword= 'changePassword',


}

export interface IRouteParams {

  profileId?: string;
  type?: string;
  eventId?: string;
}

const generate = (url: URLs, params?: IRouteParams) => {
  switch (url) {

    case URLs.default:
      return Routes.Home.default;
    /**
     *  Auth URLs
     */
    case URLs.home:
      return Routes.Home.home;

    case URLs.login:
      return Routes.Auth.login;

    case URLs.forgotPassword:
      return Routes.Auth.forgotPassword;

    case URLs.register:
      return Routes.Auth.register;

    case URLs.changePassword:
      return Routes.Auth.changePassword;

    default:
      return Routes.Home.default;

  }

};


export const NavigationUrl = {
  generate,
};
