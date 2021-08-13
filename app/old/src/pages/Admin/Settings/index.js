import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';

import ChildMenu from "../../../layout-components/CustomComponents/ChildMenu.js";
function Communication(props) {
  let currentUrl = window.location.pathname;
  let splitUrl = currentUrl.split("/");
  const routeName = "/"+splitUrl[2];
  return (
    <Fragment>
       <ChildMenu
        route={routeName}
        {...props}
        /> 
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Communication));