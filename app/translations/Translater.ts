// interface IOptions {
//   defaultValue?: string;
//   count?: number;
//   context?: string;
//   replace?: object;
//   lng?: string;
//   lngs?: string;
//   fallbackLng?: string;
//   ns?: string;
//   keySeparator?: string | boolean;
//   nsSeparator?: string;
//   returnObjects?: boolean;
//   joinArrays?: string;
//   postProcess?: 'interval';
//   interpolation?: any;
//   skipInterpolation?: boolean;
// }

// // eslint-disable-next-line no-undef
// const helper = (msg: any, optionalParams) => {
//   if (msg) {
//     const values = Object.values(msg);

//     if (values[1]) {
//       // @ts-ignore
//       values[1] = { ...values[1], ...optionalParams };
//     } else {
//       values[1] = { ...optionalParams };
//     }
//     return values;
//   }
//   return [];
// };

// // eslint-disable-next-line no-undef
// export const translate = (t: any, msg: any, optionalParams: IOptions = {}) => {
//   const vals = helper(msg, optionalParams);
//   if (vals.length === 0) {
//     // if no value found setting empty
//     return t('');
//   }
//   return t(vals[0], vals[1]);
// };
