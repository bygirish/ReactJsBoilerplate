import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';

import Dashboard from '@components/Admin/ExpenseManagement/ExpenseCategories.js';
function Expense(props) {
  return (
    <Fragment>
      <PageTitle
        titleHeading="Expense Categories"
        titleDescription=""
      />

      <Dashboard />
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(Expense));