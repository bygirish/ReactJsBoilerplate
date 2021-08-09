// import React from "react";
// import { connect } from 'react-redux';
// import { compose } from 'redux';

// import { configureDisplayMessage } from '@utils/DisplayMessageUtility';
// import { LocalStorage, StorageKeys } from "@utils/LocalStorage";
// import { Logger } from "@utils/Logger";

// import { logout } from '@common/redux/auth/actions';

// import WFRouter from "@router/Router";
// import { WebNotificationService } from '@webServices/WebNotificationService';


// interface IProps {
//   isAuthenticated: boolean;
//   logout: (installationId: string) => void;
//   isWebView: boolean;
//   setWebView: () => void;
// }

// interface IState {}

// export default class Root extends React.Component<IProps, IState> {
  
//   public async componentDidMount() {
//     const { isAuthenticated } = this.props;
//     // Global Configuration for display Messages
//     configureDisplayMessage();

//     if (isAuthenticated ) {
//       WebNotificationService.initiateNotification();
//     }

//     await this.checkWebView();

//   }

//   private checkWebView =  async () => {
//     const isWebView = await LocalStorage.get<boolean>(StorageKeys.IS_WEBVIEW);
//     const accessToken = await LocalStorage.get<string>(StorageKeys.ACCESS_TOKEN);

//     if(!!isWebView && !!accessToken) {
//      this.props.setWebView();
//     }
//   }

//   public async componentDidUpdate(prevProps: IProps) {
//      if (this.props.isAuthenticated && !prevProps.isAuthenticated) {
//         WebNotificationService.initiateNotification();

//      } else if (!this.props.isAuthenticated && prevProps.isAuthenticated) {
//        // Delete registered FCM token
//        WebNotificationService.deleteToken();
//        Logger.info('[Root - componentDidUpdate] User logged out, get guest user localisation file');
//      }
//   }

//   private logOut = async () => {
//     // unregister FCM
//     const uuid = await LocalStorage.get<string>(StorageKeys.USER_UUID);
//     // remove all notification cards
//     WebNotificationService.closeAllNotifications();
//     this.props.logout(uuid || '');
// };

//   public render() {
//     return (
//       <React.Fragment>
//         <WFRouter />
//       </React.Fragment>
//     );
//   }
// }
