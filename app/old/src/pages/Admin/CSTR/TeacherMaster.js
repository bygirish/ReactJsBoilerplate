import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';

import TeacherMasterPage from '@components/Admin/CSTR/TeacherMaster.js'; 
function TeacherMaster(props) {
  return (
    <Fragment>
      <TeacherMasterPage />
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(TeacherMaster));