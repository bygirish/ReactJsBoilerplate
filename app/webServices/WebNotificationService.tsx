// import React from 'react';

// import notification from 'antd/lib/notification';

// import { getDevicePlatform } from '@utils/DeviceInfoUtils';
// import { LocalStorage, StorageKeys } from '@utils/LocalStorage';
// import { Logger } from '@utils/Logger';
// import { getLoggedInUserId } from '@utils/UserUtils';

// import { AuthRepository } from '@repositories/AuthRepository';

// import { isAuthenticatedSelector } from '@redux/auth/selectors';

// import { IUserModel } from '@models/User';

// import { ModalClose } from '@assets/images';
// import { i18n } from '@translations/i18n';

// import { WFImg, WFPrimaryButton } from '@components/index';
// import '@components/notification_card.less';

// import { userMessages } from '@containers/User/messages';

// import Config from '@config/index';
// import { WebStoreProviderService } from '@store/WebStoreProviderService';
// import firebase from 'firebase/app';
// import 'firebase/messaging';

// const SHOW_NOTIFI_INFO_CARD = 4000;
// const NOTIF_TOP_PADDING = 70;
// class WebNotificationService {
//     messaging: any;
//     infoCardKey: string = '';
//     notificationKeys: string[] = [];

//     public init() {
//         firebase.initializeApp(Config.FIREBASE_WEB_CONFIG);
//     }

//     public getFCMToken() {

//         // if user is authenticated then only allow FCM
//         const isAuthenticated = isAuthenticatedSelector(WebStoreProviderService.getStore().getState());
//         if (!isAuthenticated) {
//             return;
//         }
//         if(!firebase.messaging.isSupported()){
//             Logger.info(
//                 '[WebNotificationService - getFCMToken()] Firebase messaging is not supported',
//             );
//             return;
//         }
//         // [START get_token]
//         // Get registration token. Initially this makes a network call, once retrieved
//         // subsequent calls to getToken will return from cache.
//         this.messaging = firebase.messaging();
//         this.messaging
//             .getToken({
//                 vapidKey: Config.FCM_VAP_KEY,
//             })
//             .then(async currentToken => {
//                 if (currentToken) {
//                     await this.sendTokenToServer(currentToken);
//                     this.setListener();
//                 } else {
//                     // Show permission request.
//                     Logger.debug(
//                         '[WebNotificationService - getFCMToken()] No registration token available. Request permission to generate one.',
//                     );
//                     // Show permission UI.
//                     this.showNotificationInfo();
//                     this.setTokenSentToServer(false);
//                 }
//             })
//             .catch(err => {
//                 Logger.warn('An error occurred while retrieving token. ', {e: err});
//                 this.setTokenSentToServer(false);
//             });
//     }

//     // Send the registration token application server, so that it can:
//     public async sendTokenToServer(currentToken) {
//         const existingFCMToken = await LocalStorage.get<IUserModel>(
//             StorageKeys.FCM_TOKEN,
//         );
//         // sendFCM token to server only if not set or token got changed
//         if (!this.isTokenSentToServer() || existingFCMToken !== currentToken) {
//             try {
//                 Logger.info('[WebNotificationService - sendTokenToServer()] Sending token to server...');
//                 await LocalStorage.set<string>(StorageKeys.FCM_TOKEN, currentToken);
//                 // const user = await LocalStorage.get<IUserModel>(StorageKeys.USER);
//                 const userId = getLoggedInUserId();
//                 if (userId) {
//                     await AuthRepository.registerUser(userId, currentToken, getDevicePlatform());
//                 }
//                 this.setTokenSentToServer(true);
//             } catch (e) {
//                 Logger.warn(
//                     '[WebNotificationService - sendTokenToServer()] error while sending token to server',
//                     {e},
//                 );
//             }
//         } else {
//             Logger.debug(
//                 "Token already sent to server so won't send it again unless it changes",
//             );
//         }
//     }

//     public isTokenSentToServer() {
//         return window.localStorage.getItem('sentToServer') === '1';
//     }

//     public setTokenSentToServer(sent) {
//         window.localStorage.setItem('sentToServer', sent ? '1' : '0');
//     }

//     /**
//      * to check whether the browser supports the promise version of Notification.requestPermission()
//      */
//     public checkNotificationPromise() {
//         try {
//             Notification.requestPermission().then();
//         } catch (e) {
//             return false;
//         }

//         return true;
//     }


//     public handlePermission(permission) {
//         // Whatever the user answers, we make sure Chrome stores the information
//         if (!('permission' in Notification)) {
//             // @ts-ignore
//             Notification.permission = permission;
//         }
//         if (permission === 'granted') {
//             Logger.log('[WebNotificationService - handlePermission()] Notification permission granted.');
//             this.getFCMToken();
//         } else {
//             Logger.log('[WebNotificationService - handlePermission()] Unable to get permission to notify.');
//         }
//     }

//     public isNotificationPermissionGranted() {
//         const permission = Notification.permission;
//         return permission === 'granted';
//     }

//     public initiateNotification() {
//         if (!firebase.messaging.isSupported()){
//             Logger.info(
//                 '[WebNotificationService - getFCMToken()] Firebase messaging is not supported',
//             );
//             return;
//         }
//         if (this.isNotificationPermissionGranted()) {
//             // if user already granted notification permission, then get FCM token
//             this.getFCMToken();
//             return;
//         }
//         // show notification informative card.
//         // let page to render, then show this card
//         setTimeout(() => this.showNotificationInfo(), SHOW_NOTIFI_INFO_CARD);
//     }

//     public showNotificationInfo() {
//         const isAuthenticated = isAuthenticatedSelector(WebStoreProviderService.getStore().getState());
//         if (!isAuthenticated) {
//             return;
//         }
//         const key = this.getNotificationKey();
//         // store to close after
//         this.infoCardKey = key;
//         const btn = (
//             <WFPrimaryButton htmlType={'button'} onClick={() => {
//                 this.requestPermission();
//                 this.infoCardKey = '';
//                 notification.close(key);
//             }}>
//                 {i18n.t(userMessages.subscribe.key)}
//             </WFPrimaryButton>
//         );
//         notification.open({
//             message: i18n.t(userMessages.notificationInfoTitle.key),
//             description:
//                 i18n.t(userMessages.notificationInfoMessage.key),
//             btn,
//             key,
//             duration: 0,
//             placement: 'topLeft',
//             top: NOTIF_TOP_PADDING,
//             className: 'notification_card'
//         });
//     }

//     public requestPermission() {
//         // Let's check if the browser supports notifications
//         if (!('Notification' in window)) {
//             Logger.info('[WebNotificationService - handlePermission()] This browser does not support desktop notification');
//         } else {
//             if (this.checkNotificationPromise()) {
//                 Notification.requestPermission().then(permission => {
//                     this.handlePermission(permission);
//                 });
//             } else {
//                 Notification.requestPermission(function (permission) {
//                     this.handlePermission(permission);
//                 });
//             }
//         }
//     }

//     public getNotificationKey() {
//         return `advantage${Date.now()}`;
//     }

//     public closeAllNotifications() {
//         // close permission info card if its opened
//         if(this.infoCardKey){
//             notification.close(this.infoCardKey);
//             this.infoCardKey = '';
//         }
//         // close other notification cards
//         if(this.notificationKeys && this.notificationKeys.length > 0){
//             this.notificationKeys.map((key) => {
//                notification.close(key);
//             });
//         }
//         this.notificationKeys = [];
//     }

//     public deleteToken() {
//         this.closeAllNotifications();
//         // if messaging not initiated, than no need to call delete token
//         if(!this.messaging) {
//             return;
//         }
//         // Delete registraion token.
//         this.messaging
//             .deleteToken()
//             .then(() => {
//                 Logger.info('[WebNotificationService - deleteToken()] FCM Token deleted.');
//                 this.setTokenSentToServer(false);
//             })
//             .catch(err => {
//                 Logger.log( '[WebNotificationService - deleteToken()] Unable to delete token. ', err);
//             });
//     }

//     public setListener = () => {
//         // Handle incoming messages. Called when:
//         // - a message is received while the app has focus
//         // - the user clicks on an app notification created by a service worker
//         //   `messaging.setBackgroundMessageHandler` handler.
//         this.messaging.onMessage(payload => {
//             Logger.info('[WebNotificationService - setListener()] Message received. ', {payload})
//             const { notification } = payload;
//             if (notification && notification.title){
//                 this.appendMessage(notification);
//             }
//         });

//         // add listener for background notifications
//         if (navigator.serviceWorker) {
//             navigator.serviceWorker.addEventListener('message', event => {
//                 const message = event.data;
//                 if ( !(message && message.data) ) {
//                     return;
//                 }
//                 const data = message.data;
//                 // only coming from system notification click
//                 if(message.messageType === 'notification-clicked'){
//                     window.open(data.url, '_parent'/*'_blank'*/)
//                 }
//             });
//         }
//     };

//     public appendMessage(data) {
//         const key = this.getNotificationKey();
//         this.notificationKeys = [...this.notificationKeys, key];
//         notification.open({
//             message: data.title,
//             description: data.body,
//             onClick: () => {
//                 notification.close(key);
//                 if (data.url) {
//                     window.open(data.url, '_parent'/*'_blank'*/)
//                 }
//             },
//             duration: 6,
//             key,
//             top: NOTIF_TOP_PADDING,
//             closeIcon: <WFImg src={ModalClose}/>,
//             className: 'notification_card',
//         });
//     }
// }

// const webNotificationService = new WebNotificationService();
// export {webNotificationService as WebNotificationService};
