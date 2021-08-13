import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';

import Dashboard from '@components/Admin/Settings/Institutions/AddInstitutions.js';
function Settings(props) {
  return (
    <Fragment>
      <Dashboard />
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Settings));