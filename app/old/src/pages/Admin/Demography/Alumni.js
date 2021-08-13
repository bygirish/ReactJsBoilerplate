import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';

import Dashboard from '@components/Admin/Demography/Alumni';
function Student(props) {
  return (
    <Fragment>
      <PageTitle
        titleHeading="Alumni Demography"
        titleDescription=""
      />

      <Dashboard  {...props}/>
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Student));