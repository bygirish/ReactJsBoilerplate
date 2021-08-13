import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';
import { PageTitle } from '../../../layout-components';
import AttendanceChart from '@components/Admin/Dashboard/Section1';
import CountSection from '@components/Admin/Dashboard/Section2';
function Dashboard(props) {
  return (
    <Fragment>
      <PageTitle
        titleHeading="Dashboard"
        titleDescription=""
        {...props}
      /> 
      <AttendanceChart {...props} />
      <CountSection {...props} />
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Dashboard));