import moment, { Moment } from 'moment';
import 'moment/locale/es';
import { getLanguage } from '@utils/LanguageUtils';
import { i18n } from '@translations/i18n';
import { messages } from "@utils/Messages";

export const DATE_FORMAT_3 = 'DD.MM.YYYY';
export const DateTimeFormat = { D_M_YYYY: 'D/M/YYYY' };
export const DATE_FORMAT_4 = "YYYY-MM-DD HH:mm:00";
export const DATE_FORMAT_5 = "MMMM Do YYYY";
export const DATE_FORMAT_6 = "YYYY-MM-DD";
export const TIME_FORMAT = "h:mm a";

const getDateFromTimeStamp = (timeStamp: Date): string => {
  return (moment(timeStamp).locale(getLanguage()).format('DD MMM'));
};

const getHourFromTimeStamp = (timeStamp: Date, meridiem: boolean): string => {
  const am = meridiem ? 'a' : '';
  return moment(timeStamp).locale(getLanguage()).format('h:mm' + am);
};

const getHourAgoTimeStamp = (timeStamp: Date): string => {
  return moment(timeStamp).locale(getLanguage()).fromNow();
};

const getCurrentDateTime = (): string => {
  return moment().locale(getLanguage()).toISOString();
};

const getModifiedDateFromTimeStamp = (timeStamp: Date) => {
  return (moment(timeStamp).locale(getLanguage()).format('Do MMM'));
};

const getModifiedDateTimeStamp = (timeStamp: Date): string => {
  return (moment(timeStamp).locale(getLanguage()).format('DD MMM, YYYY'));
};

const getModifiedDay = (timeStamp: string): string => {
  return (moment(timeStamp, 'DD MMM, YYYY').locale(getLanguage()).format('dddd'));
};

const getDateTime = (timeStamp: Date, format: string) => {
  return (moment(timeStamp).locale(getLanguage()).format(format));
};

export const isBeforeDate = (date1: string, date2: string) => {
  return moment(date1).isBefore(date2);
};

export const isOverdueDate = (date: string) => {
  return moment(date).isBefore(moment());
};

const convertDateTimeToString = (date: Date): string => {
  return moment(date).toISOString();
};

const isToday = (timeStamp: Date): string => {
  const convertedTimeStamp = moment(timeStamp, 'DD/MM/YYYY');
  if ( convertedTimeStamp.isSame(new Date(), 'day') ) {
    return i18n.t(messages.today.key);
  }
  return getDateFromTimeStamp(timeStamp);
};

export const getMomentFormat = (date: string, format: string): Moment => {
  return moment(date, format)
    .local(getLanguage())
}

export const getDateDifferenceInDays = (currentDate: any, nextDate: any): number => {
  return moment(nextDate)
    .diff(moment(currentDate), 'days')
}

export const getCommentHourFromTimeStamp = (timeStamp: Date | string, meridien: boolean): string => {
  const am = meridien ? 'A' : '';
  return moment(timeStamp).format('h:mm ' + am);
};

export const disablePastDate = (current) => {
  return current && current.valueOf() < Date.now();
}

export const getCurrentDate = () => {
  return moment(new Date().toISOString()).format(DATE_FORMAT_6);
}
// Returns formated current and next date along with their difference in days

export const getDateFormatedData = (currentDate: any, nextDate: any) => {
  const d1 = DateHelper.getDateTime(currentDate, DATE_FORMAT_3);
  const d2 = DateHelper.getDateTime(nextDate, DATE_FORMAT_3);
  const formatedCurrentDate: any = DateHelper.getMomentFormat(d1, DATE_FORMAT_3);
  const formatedNextDate: any = DateHelper.getMomentFormat(d2, DATE_FORMAT_3);
  const diff = DateHelper.getDateDifferenceInDays(formatedCurrentDate, formatedNextDate);
  return { formatedCurrentDate, formatedNextDate, diff }
}

export const DateHelper = {
  getDateFromTimeStamp,
  getHourFromTimeStamp,
  getCurrentDateTime,
  getModifiedDateFromTimeStamp,
  getModifiedDateTimeStamp,
  getModifiedDay,
  getDateTime,
  isBeforeDate,
  convertDateTimeToString,
  getHourAgoTimeStamp,
  isOverdueDate,
  isToday,
  getMomentFormat,
  getDateDifferenceInDays,
  getCommentHourFromTimeStamp,
  getDateFormatedData,
  disablePastDate,
  getCurrentDate
};
