// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';
// import { AppLanguage } from '@translations/AppLanguage';
// import history from '@utils/history';
// import { Routes } from '@navigator/Routes';
// import { i18n } from '@translations/i18n';
// interface IProps {
//   RouterComponent: React.ComponentClass<any>;
//   defaultLanguage?: string;
//   children: any;
// }

// export const LocalizedRouter = (props: IProps) => {
//   const { RouterComponent, defaultLanguage, children } = props;
//   return (
//     <RouterComponent history={history}>
//       <Route path={Routes.Home.lang}>
//         {({ match, location }) => {
//           /**
//            * Get current language
//            * Set default locale to en if base path is used without a language
//            */
//           const params = match ? match.params : {};
//           const { lang = defaultLanguage || AppLanguage.English } = params;
//           /**
//            * If language is not in route path, redirect to language root
//            */
//           const { pathname } = location;
//           if (!pathname.includes(`/${lang}`)) {
//             return <Redirect to={`/${lang}${Routes.Home.default}`} />;
//           } else {
//             // lang includes
//             const appLang = i18n.language;
//             if (!pathname.includes(`/${appLang}`)) {
//               const [, route] = pathname.split(`/${lang}`);
//               return <Redirect to={`/${appLang}${route}`} />;
//             }
//           }

//           /**
//            * Return Intl provider with default language set
//            */
//           return children;
//         }}
//       </Route>
//     </RouterComponent>
//   );
// };
