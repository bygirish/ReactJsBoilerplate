import moment from 'moment';
import { v1 as uuidv1 } from 'uuid';
// import { SessionStorage, SessionStorageKeys } from './SessionStorage';

export const getAppVersion = (): string => {
  // pick web version from package.json
  return '1.0.0';
};

export const getDevicePlatform = (): string => {
  return 'web';
};

export const getAppName = (): string => {
  // pick app name from package.json
  return 'wf-advantage';
};

export const getTimeZone = (): string => {
  const offset = new Date().getTimezoneOffset();
  const formatted = -(offset / 60);
  return formatted.toString();
};

export const getDeviceScreenType = () => {
  // width Specification
  // * xs (for phones - screens less than 768px wide)
  // * sm (for tablets - screens equal to or greater than 768px wide)
  // * md (for small laptops - screens equal to or greater than 992px wide)
  // * lg (for laptops and desktops - screens equal to or greater than 1200px wide)
  // Reference - https://www.w3schools.com/bootstrap/bootstrap_grid_small.asp
  const deviceWidth = window.innerWidth;
  if (deviceWidth < 768) return 'xs';
  else if (deviceWidth >= 768 && deviceWidth < 992) return 'sm';
  else if (deviceWidth >= 992 && deviceWidth < 1200) return 'md';
  else if (deviceWidth >= 1200) return 'lg';
};

export const getClientTraceId = () => {
  return uuidv1();
};

export const getClientSessionId = () => {

  const clientSessonData: {
    clientSessonId: string;
    clientSessonIdExpiryTime: string;
  } = null;

  if (
    !clientSessonData ||
    moment().diff(moment(clientSessonData.clientSessonIdExpiryTime)) >= 0
  ) {
    let clientSessonId = uuidv1();
    let clientSessonIdExpiryTime = moment()
      .add(24, 'hours')
      .toISOString();
    // SessionStorage.set(SessionStorageKeys.CLIENT_SESSION_DATA, {
    //   clientSessonId: clientSessonId,
    //   clientSessonIdExpiryTime: clientSessonIdExpiryTime,
    // });

    return clientSessonId;
  }

  let { clientSessonId } = clientSessonData;
  return clientSessonId;
};
