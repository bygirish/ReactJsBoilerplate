import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../utils/MapStateDispatchProps.js';

import Dashboard from '../../../components/Admin/ExpenseManagement';
function FeeIncome(props) {
  return (
    <Fragment>
      <PageTitle
        titleHeading="Expense Management"
        titleDescription=""
      />

      <Dashboard />
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(FeeIncome));