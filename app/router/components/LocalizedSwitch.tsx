// import React from 'react';
// import { Switch, RouteProps } from 'react-router';
// import { i18n } from '@translations/i18n';

// export const LocalizedSwitch: React.FC = ({ children }) => {
//   /**
//    * inject params and formatMessage through hooks, so we can localize the route
//    */
//   const locale = i18n.language;
//   /**
//    * Apply localization to all routes
//    * Also checks if all children elements are <Route /> components
//    */
//   return (
//     <Switch>
//       {React.Children.map(children, child =>
//         React.isValidElement<RouteProps>(child)
//           ? React.cloneElement(child, {
//               ...child.props,
//               path: localizeRoutePath(child.props.path),
//             })
//           : child,
//       )}
//     </Switch>
//   );

//   /**
//    *
//    * @param path can be string, undefined or string array
//    * @returns Localized string path or path array
//    */
//   function localizeRoutePath(path?: string | string[]) {
//     switch (typeof path) {
//       case 'undefined':
//         return undefined;
//       case 'object':
//         return path.map(key => `/${locale}${key}`);
//       default:
//         const isFallbackRoute = path === '*';
//         return isFallbackRoute ? path : `/${locale}${path}`;
//     }
//   }
// };
