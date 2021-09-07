import React, { Suspense, lazy } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { BrowserScrollService } from "@utils/BrowserScrollService";
import { ConnectedRouter } from "connected-react-router";
import history from "@utils/history";
import { Routes } from "@navigator/Routes";

import Spinner from "@components/atoms/Spinner";


// Home
const HomePage = lazy(() => import("@containers/Home/HomePageContainer"));


const FormBuilder = lazy(() => import("@containers/FormBuilder/FormBuilderContainer")); 





interface IProps {
  location?: any;
}

interface IState {}

const setParentRef = (pRef: any) => {
  BrowserScrollService.init(pRef);
};

export const mapStateToProps = (state: any) => {
  return {
    location: state.router.location,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return {};
};

class Router extends React.Component<IProps, IState> {
  scrollRef: any;

  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
  }

  public render() {
    const { location } = this.props;

    const isAuthenticated  = false;

    let RouteWrapper: any;
    // if (isAuthenticated) {
    //   RouteWrapper = RoutePrivate;
    // } else {
    //   RouteWrapper = RoutePublic;
    // }

    return (
      <ConnectedRouter history={history}>
        <Suspense fallback={<Spinner isFullPage />}>
          <Switch>

            <Route
              exact
              path={Routes.Home.default}
              render={(props) => <HomePage {...props} />}
            />
            <Route
              exact
              path={Routes.FormBuilder.default}
              render={(props) => <FormBuilder {...props} />}
            />

            {/* <Route
              exact
              path={Routes.Auth.login}
              render={(props) => <LoginNew {...props} />}
            />

            <Route
              exact
              path={Routes.Auth.resetPassword}
              render={(props) => <ResetPassword {...props} />}
            />
            <Route
              exact
              path={Routes.Auth.changePassword}
              render={(props) => <ChangePassword {...props} />}
            />
            <Route
              exact
              path={Routes.Auth.forgotPassword}
              render={(props) => <ForgotPassword {...props} />}
            /> */}

            <Redirect to={Routes.PageNotFound.notFound} />
          </Switch>
        </Suspense>
      </ConnectedRouter>
    );
  }

  public componentDidMount = () => {
    const reactNode = this.scrollRef.current;
    setParentRef(reactNode);
  };
}

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Router));
