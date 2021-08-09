// import React from "react";
// import { Redirect, Route } from "react-router-dom";
// // import AuthLayout from "@layout/AuthLayout";
// import { connect } from "react-redux";
// import { Routes } from "@navigator/Routes";
// import { NavigationUrl, URLs } from "@navigator/NavigationUrl";

// interface IProps {
//   component: React.ComponentType<any>;
//   location: any;
//   isAuthenticated: boolean;
//   exact?: boolean;
//   path: string;
//   to?: string;
//   errorInFetchAppData?: string;
// }

// export const mapStateToProps = (state: any) => {
//   return {};
// };

// export const mapDispatchToProps = (dispatch: any) => {
//   return {};
// };

// export class RoutePublic extends React.Component<IProps, any> {
//   private defaultPrivateRoute = NavigationUrl.generate(URLs.home); 

//   private renderComponent = () => {
//     return <AuthLayout {...this.props} />;
//   };

//   private renderRedirect = (routeProps: any) => {
//     const {
//       component: Component,
//       isAuthenticated,
//       to = this.defaultPrivateRoute, 
//       ...rest
//     } = routeProps;
//     return (
//       <Redirect
//         to={{
//           pathname: to,
//           state: {
//             redirect: to,
//             isAuthenticated: true,
//           },
//         }}
//       />
//     );
//   };

//   render() {
//     const {
//       component: Component,
//       isAuthenticated,
//       errorInFetchAppData,
//       to,
//       ...rest
//     } = this.props;

//     return (
//       <Route
//         {...rest}
//         render={isAuthenticated ? this.renderRedirect : this.renderComponent}
//       />
//     );
//   }
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(RoutePublic);
