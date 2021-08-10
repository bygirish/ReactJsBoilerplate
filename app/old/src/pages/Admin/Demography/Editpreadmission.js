import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../utils/MapStateDispatchProps.js';

import Dashboard from '../../../components/Admin/Demography/EditPreadmissionSetting';
function EditPreadmissionSetting(props) {
  return (
    <Fragment>
      <PageTitle
        titleHeading="Edit PreadmissionSetting"
        titleDescription=""
      />

      <Dashboard  {...props}/>
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(EditPreadmissionSetting));