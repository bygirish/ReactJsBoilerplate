
import React, { Fragment } from 'react'; 
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {mapStateToProps, mapDispatchToPros} from '../../../utils/MapStateDispatchProps.js';

import Dashboard from '../../../components/Admin/Reports/academic-reports/TcReportManagement';

function TcReportManagement(props) { 
  return (
    <Fragment>
      <Dashboard {...props} />
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(TcReportManagement));
