import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { PageTitle } from '../../layout-components';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../utils/MapStateDispatchProps.js';

import DashboardCrmManagerSection1 from '../../components/DashboardCrmManager/DashboardCrmManagerSection1';
import DashboardCrmManagerSection2 from '../../components/DashboardCrmManager/DashboardCrmManagerSection2';
import DashboardCrmManagerSection3 from '../../components/DashboardCrmManager/DashboardCrmManagerSection3';
import DashboardCrmManagerSection4 from '../../components/DashboardCrmManager/DashboardCrmManagerSection4';
import DashboardCrmManagerSection5 from '../../components/DashboardCrmManager/DashboardCrmManagerSection5';
import DashboardCrmManagerSection6 from '../../components/DashboardCrmManager/DashboardCrmManagerSection6';
import DashboardCrmManagerSection7 from '../../components/DashboardCrmManager/DashboardCrmManagerSection7';
import DashboardCrmManagerSection8 from '../../components/DashboardCrmManager/DashboardCrmManagerSection8';
function DashboardCrmManager(props) {
  console.log(props.data.token);
  return (
    <Fragment>
      <PageTitle
        titleHeading="CRM Manager"
        titleDescription="If you&#39;re building a CRM, you can start by using this dashboard example."
      />

      <DashboardCrmManagerSection1 />
      <DashboardCrmManagerSection2 />
      <DashboardCrmManagerSection3 />
      <DashboardCrmManagerSection4 />
      <DashboardCrmManagerSection5 />
      <DashboardCrmManagerSection6 />
      <DashboardCrmManagerSection7 />
      <DashboardCrmManagerSection8 />
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(withRouter(DashboardCrmManager));