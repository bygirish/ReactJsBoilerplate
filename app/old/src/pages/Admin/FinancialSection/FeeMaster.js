import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../utils/MapStateDispatchProps.js';

import FeeMaster from '../../../components/Admin/FinancialSection/FeeIncome/FeeMaster.js';
function FeeIncome(props) {
  return (
    <Fragment>
      <FeeMaster />
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(FeeIncome));