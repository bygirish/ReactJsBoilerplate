import {

    ERR_USER,
    NO_NETWORK,
} from '@common/network/constants';

import { i18n } from '@translations/i18n';

export const getErrorCodes = (e: any): string => {
    let error = e.message;
    if (e.details && e.details.code) {
        error = e.details.code;
    }
    return error;
};

export const ErrorParser = (errorCode: string): string => {
    if (!errorCode) {
        return '';
    }
    switch (errorCode) {
    case NO_NETWORK:
        return i18n.t('API_ERRORS.IAM_SERVICE.NO_NETWORK');
    case ERR_USER:
        return i18n.t('API_ERRORS.IAM_SERVICE.ERR_USER_NOT_FOUND');

    default:
        return i18n.t('API_ERRORS.IAM_SERVICE.SOMETHING_WENT_WRONG');
    }
};
