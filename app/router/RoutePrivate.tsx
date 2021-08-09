// import React from "react";
// import { Route, Redirect } from "react-router-dom";

// import Dashboard from "@layout/Dashboard";
// import { NavigationUrl, URLs } from "@navigator/NavigationUrl";

// interface IProps {
//   component: React.ComponentType<any>;
//   location: any;
//   isAuthenticated: boolean;
//   exact?: boolean;
//   to?: string;
//   path: string;
// }

// export class RoutePrivate extends React.Component<IProps, any> {
//   private defaultPublicRoute = NavigationUrl.generate(URLs.home)

//   private renderDashboard = () => {
//     return <Dashboard {...this.props} />;
//   };

//   private renderRedirect = (routeProps: any, to: any) => {
//     return (
//       <Redirect
//         to={{
//           pathname: to,
//         }}
//       />
//     );
//   };

//   render() {
//     const {
//       component: Component,
//       isAuthenticated,
//       to = this.defaultPublicRoute,
//       path,
//       ...rest
//     } = this.props;

//     if (isAuthenticated) {
//       return <Route {...rest} render={this.renderDashboard} />;
//     } else {
//       return (
//         <Route {...rest} render={(props) => this.renderRedirect(props, to)} />
//       );
//     }
//   }
// }
