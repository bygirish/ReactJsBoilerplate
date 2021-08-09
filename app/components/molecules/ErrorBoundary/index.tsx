// import React from "react";
// import { withTranslation } from 'react-i18next';

// import Modal from "antd/lib/modal";

// import { Logger } from "@utils/Logger";

// import { translate } from '@translations/Translater';

// import { globalMessages } from '@components/messages';

// import navigator from '@navigator/index';
// import { NavigationUrl , URLs } from '@navigator/NavigationUrl';

// import { WebViewMessageType } from '@constants/config';
// import { StorageKeys } from "@utils/LocalStorage";

// interface IState {
//     hasRenderError: boolean;
//     hasChunkError: boolean;
// }

// interface IProps {
//     t: any;
// }

// const chunkError = 'ChunkLoadError';

// class ErrorBoundary extends React.Component<IProps, IState> {

//     state = {
//         hasChunkError: false,
//         hasRenderError: false
//     };

//     static getDerivedStateFromError(error: any) {
//         if(error.toString().includes(chunkError)){
//             return {
//                 hasChunkError: true
//             };
//         } else {
//             return {
//                 hasRenderError: true
//             };
//         }
//     }

//     private reloadPage = () => {
//         window.location.href = window.location.href;
//         this.setState({ hasChunkError: false});
//         return false;
//     }

//     private gotoHomePage = () => {
//         this.setState({ hasRenderError: false});

//         const isWebView = window.localStorage.getItem(StorageKeys.IS_WEBVIEW);

//         if(isWebView) {
//             // @ts-ignore
//             window.ReactNativeWebView.postMessage(JSON.stringify(
//                 {
//                     MESSAGE_TYPE: WebViewMessageType.ERROR_GO_TO_HOME_PAGE,
//                 }
//             ));
//         } else {
//             navigator.replace(NavigationUrl.generate(URLs.home));
//             location.reload();
//         }

//         return false;
//     }

//     private chunkErrorPopup = () => {
//         const { t } = this.props;
//         return Modal.info({
//             title: translate(t, globalMessages.chunkError),
//             style: null,
//             okText: translate(t, globalMessages.update),
//             content: (
//                 <div>
//                     <p>{translate(t, globalMessages.chunkErrorReloadMessage)}</p>
//                 </div>
//             ),
//             onOk: () => this.reloadPage(),
//         })
//     }

//     private appErrorPopup = () => {
//         const { t } = this.props;
//         return Modal.info({
//             title: translate(t, globalMessages.appError),
//             style: null,
//             okText: translate(t, globalMessages.goToHomepage),
//             onOk: () => this.gotoHomePage(),
//         })
//     }

//     render() {
//         if (this.state.hasChunkError) {
//            return this.chunkErrorPopup();
//         } else if(this.state.hasRenderError){
//            return this.appErrorPopup();
//         }
//         return this.props.children;
//     }
// }

// // @ts-ignore
// export default withTranslation()(ErrorBoundary);
