import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../../../utils/MapStateDispatchProps.js';

import Dashboard from 'components/Admin/Utilities/TransportationManagement/FleetManagement/RoleMaster';
function RoleMaster(props) {
  return (
    <Fragment>
      <Dashboard {...props} />
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(RoleMaster));