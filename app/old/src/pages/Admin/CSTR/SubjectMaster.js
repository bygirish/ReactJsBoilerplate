import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../utils/MapStateDispatchProps.js';

import SubjectMasterPage from '../../../components/Admin/CSTR/SubjectMaster.js'; 
function SubjectMaster(props) {
  return (
    <Fragment>
      <SubjectMasterPage />
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(SubjectMaster));