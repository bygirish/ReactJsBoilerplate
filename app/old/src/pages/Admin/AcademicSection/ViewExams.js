import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';

import Dashboard from '@components/Admin/AcademicSection/OnlineExam/ViewExams.js';
function ViewExams(props) {
  return (
    <Fragment>
      <Dashboard />
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(ViewExams));