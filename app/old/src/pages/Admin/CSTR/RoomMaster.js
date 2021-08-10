import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../../utils/MapStateDispatchProps.js';

import RoomMasterPage from '../../../components/Admin/CSTR/RoomMaster.js'; 
function RoomMaster(props) {
  return (
    <Fragment>
      <RoomMasterPage />
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(RoomMaster));