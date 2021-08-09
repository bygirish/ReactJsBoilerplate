// /**
//  * app.js
//  *
//  * This is the entry file for the application, only setup and boilerplate
//  * code.
//  */

// // Needed for redux-saga es6 generator support
// import '@babel/polyfill';
// import 'reflect-metadata';

// // Import all the third party stuff
// import React, { Suspense } from 'react';
// import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
// // Import root app
// import RootContainer from '@containers/Root/RootContainer';
// import * as OfflinePluginRuntime from 'offline-plugin/runtime';

// // Load the favicon and the .htaccess file
// // import '!file-loader?name=[name].[ext]!./images/favicon.ico';
// import { I18nextProvider } from 'react-i18next';
// import { i18n } from '@translations/i18n';
// import '!file-loader?name=[name].[ext]!./firebase-messaging-sw.js';
// import '!file-loader?name=[name].[ext]!./assets/Images/WF-Logo-Color.png';
// import 'file-loader?name=.htaccess!./.htaccess';

// import { WebStoreProviderService } from '@store/WebStoreProviderService';
// import { WebNotificationService } from '@webServices/WebNotificationService';

// import "@theme/index.less";
// import ErrorBoundary from '@components/molecules/ErrorBoundary';

// const store = WebStoreProviderService.getStore();

// const MOUNT_NODE = document.getElementById('app');

// const initializeFirebase = () => {
//   WebNotificationService.init();
// };

// const render = () => {
//   initializeFirebase();

//   ReactDOM.render(
//     <Provider store={store}>
//       <Suspense fallback={null}>
//         <I18nextProvider i18n={i18n}  >
//           <ErrorBoundary>
//             <RootContainer />
//           </ErrorBoundary>
//         </I18nextProvider>
//       </Suspense>
//     </Provider>,
//     MOUNT_NODE,
//   );
// };

// render();

// // Install ServiceWorker and AppCache in the end since
// // it's not most important operation and if main code fails,
// // we do not want it installed
// if (process.env.NODE_ENV === 'production') {
//   OfflinePluginRuntime.install({
//     onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
//     onUpdated: () => {
//       (window as any).swUpdate = true
//     },
//   });
// }
