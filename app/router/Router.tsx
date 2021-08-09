// import React, { Suspense, lazy } from "react";
// import { connect } from "react-redux";
// import { withTranslation } from "react-i18next";
// import {
//   BrowserRouter as Router,
//   Route,
//   Switch,
//   Redirect,
// } from "react-router-dom";
// import "antd/dist/antd.css";
// import { BrowserScrollService } from "@utils/BrowserScrollService";
// import { ConnectedRouter } from "connected-react-router";
// import history from "@utils/history";
// import { Routes } from "@navigator/Routes";
// import { isAuthenticatedSelector } from "@common/redux/auth/selectors";
// import { RoutePrivate } from "@router/RoutePrivate";
// import RoutePublic from "@router/RoutePublic";

// // Auth
// const ResetPassword = lazy(() =>
//   import("@containers/Auth/ResetPasswordContainer")
// );
// const ChangePassword = lazy(() =>
//   import("@containers/Auth/ChangePasswordContainer")
// );
// const ForgotPassword = lazy(() =>
//   import("@containers/Auth/ForgotPasswordContainer")
// );
// const LoginNew = lazy(() => import("@containers/Auth/LoginContainer"));
// const RegisterUser = lazy(() =>
//   import("@containers/Auth/RegisterUserContainer")
// );
// const TnC = lazy(() => import("@containers/Auth/TnCContainer"));



// import "antd/dist/antd.css";
// import "./../App.scss";

// interface IProps {
//   primaryLanguage?: any;
//   isAuthenticated: boolean;
//   location: any;
// }

// interface IState {}

// const setParentRef = (pRef: any) => {
//   BrowserScrollService.init(pRef);
// };

// export const mapStateToProps = (state: any) => {
//   return {
//     isAuthenticated: isAuthenticatedSelector(state),
//     location: state.router.location,
//   };
// };

// export const mapDispatchToProps = (dispatch: any) => {
//   return {};
// };

// export class WFRouter extends React.Component<IProps, IState> {
//   scrollRef: any;

//   constructor(props) {
//     super(props);
//     this.scrollRef = React.createRef();
//   }

//   public render() {
//     const { location } = this.props;
//     let { isAuthenticated } = this.props;

//     let RouteWrapper: any;
//     if (isAuthenticated) {
//       RouteWrapper = RoutePrivate;
//     } else {
//       RouteWrapper = RoutePublic;
//     }

//     return (
//       <ConnectedRouter history={history}>
//         <Suspense fallback={<Spinner showFullPage />}>
//           <Switch>

//             <Route
//               exact
//               path={Routes.Auth.login}
//               render={(props) => <LoginNew {...props} />}
//             />

//             <Route
//               exact
//               path={Routes.Auth.resetPassword}
//               render={(props) => <ResetPassword {...props} />}
//             />
//             <Route
//               exact
//               path={Routes.Auth.changePassword}
//               render={(props) => <ChangePassword {...props} />}
//             />
//             <Route
//               exact
//               path={Routes.Auth.forgotPassword}
//               render={(props) => <ForgotPassword {...props} />}
//             />

//             <Redirect to={Routes.PageNotFound.notFound} />
//           </Switch>
//         </Suspense>
//       </ConnectedRouter>
//     );
//   }

//   public componentDidMount = () => {
//     const reactNode = this.scrollRef.current;
//     setParentRef(reactNode);
//   };
// }

// // @ts-ignore
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withTranslation()(WFRouter));
