import { ApiClientError } from '@network/apiClientError';

const validate = (getValidationSchema: any): any => (values: any[]) => {
    const validationSchema = getValidationSchema(values);
    try {
        validationSchema.validateSync(values, { abortEarly: false });
        return {};
    } catch (error) {
        return getErrorsFromValidationError(error);
    }
};

const getErrorsFromValidationError = (validationError: any) => validationError.inner.reduce((errors: any[], error: any) => ({
    ...errors,
    [error.path]: error.errors[0] || '...'
}), {});

const validatePhone = (text: string): boolean => {
    if (/^\d{10}$/.test(text)) {
        return true;
    }
    return false;
};

const formatServerErrorsToFormErrors = (error: ApiClientError): any => {
    const errorDetails = error.details;
    if (!errorDetails) {
        return {};
    }

    const fieldErrors = errorDetails.errors || [];
    return fieldErrors.reduce((errorObject: any, err: any) => {
        errorObject[err.field] = err.reason;
        return errorObject;
    }, {});
};

const validateEmail = (email: string) => {
    const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]+)$/;

    return regex.test(email);
};

const validateEmptyData = (data: string) => data !== '';

export const isValidNumber = (value: any): boolean => (
    isFinite(value)
    && countDecimals(value) <= 6
    && parseFloat(value) < Number.MAX_SAFE_INTEGER
);

const countDecimals = (value: any): number => {
    if (value % 1 !== 0) {
        return value.toString().split('.')[1].length;
    }
    return 0;
};

export const isBlankOrUndefined = (str: string | undefined) => !str || /^\s*$/.test(str);

export const isURL = (url: string): boolean => {
    const regex = '(http(s)?:\\/\\/.)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&\\/=]*)';
    const matched = url.trim().match(regex);
    if (matched && matched.length > 0) {
    // for prefect match
        if (matched[0] === url) {
            return true;
        }
    }
    return false;
};

export const validatePassword = (password: string) => {
    const regex = new RegExp('^(?=.*[a-z])(?=.*[0-9])(?=.{8,})');
    return regex.test(password);
};

export const isValidPhoneNumber = (number: string): boolean => number && number.length >= 8 && number.length <= 15;

export const FormHelper = {
    validate,
    validatePhone,
    getErrorsFromValidationError,
    formatServerErrorsToFormErrors,
    validateEmail,
    validateEmptyData,
    isBlankOrUndefined,
    isValidNumber,
    isURL,
    validatePassword,
    isValidPhoneNumber
};
