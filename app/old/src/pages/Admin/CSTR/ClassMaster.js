import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';

import ClassMasterPage from '@components/Admin/CSTR/ClassMaster.js'; 
function ClassMaster(props) {
  return (
    <Fragment>
      <ClassMasterPage />
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(ClassMaster));