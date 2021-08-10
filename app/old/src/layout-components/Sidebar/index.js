import React, { Fragment, useState, useEffect  } from 'react';

import clsx from 'clsx';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { Hidden, Drawer, Paper } from '@material-ui/core';

import { connect } from 'react-redux';

import SidebarHeader from '../../layout-components/SidebarHeader';
import SidebarUserbox from '../../layout-components/SidebarUserbox';
import SidebarMenu from '../../layout-components/SidebarMenu';
import SidebarFooter from '../../layout-components/SidebarFooter';
import Service from '../../utils/Service';
import { setUserData , getUserData , updateUserData , removeUserData, changeOrganization, getModulePermission} from '../../actions/';
import navItems from './navItems';
import BarChartIcon from '@material-ui/icons/BarChart';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ChatIcon from '@material-ui/icons/ChatOutlined';
import CodeIcon from '@material-ui/icons/Code';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import FolderIcon from '@material-ui/icons/FolderOutlined';
import DashboardTwoToneIcon from '@material-ui/icons/DashboardTwoTone';
import GradeTwoTone from '@material-ui/icons/GradeTwoTone';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LockOpenIcon from '@material-ui/icons/LockOpenOutlined';
import MailIcon from '@material-ui/icons/MailOutlined';
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

import DashboardIcon from "@material-ui/icons/Dashboard";
import BookIcon from "@material-ui/icons/Book";
import DateRange from "@material-ui/icons/DateRange";
import Face from "@material-ui/icons/Face";
import Sms from "@material-ui/icons/Sms";
import Schedule from "@material-ui/icons/Schedule";
import School from "@material-ui/icons/School";
import People from "@material-ui/icons/People";
import Store from "@material-ui/icons/Store";
import AccountBalance from "@material-ui/icons/AccountBalance";
import TrackChanges from "@material-ui/icons/TrackChanges";
import Description from "@material-ui/icons/Description";
import PieChart from "@material-ui/icons/PieChart";
import SettingsIcon from "@material-ui/icons/Settings";
import i18n from '../../i18n';

import {
  setSidebarToggleMobile,
  setSidebarHover,
  setSidebarToggle,
  setSidebarFooter,
  setSidebarUserbox
} from '../../reducers/ThemeOptions';

const Sidebar = props => {

  const iconsMap = {
    DashboardIcon: DashboardIcon,
    BookIcon: BookIcon,
    DateRange: DateRange,
    Face: Face,
    Sms: Sms,
    Schedule: Schedule,
    School: School,
    People: People,
    Store: Store,
    AccountBalance: AccountBalance,
    TrackChanges: TrackChanges,
    Description: Description,
    PieChart: PieChart,
    SettingsIcon: SettingsIcon,
  };

  const arr=[];
  console.log(props.data.module_permissions);
  props.data.module_permissions && props.data.module_permissions.map(el=>{
    if(el.can_view == "1"){
      arr.push({"label":el.name,"icon":el.icon,"to":"/admin"+el.path})
    }
  })
      const myJSON = JSON.stringify(arr);
      const menu = [
        {
          // label: 'Navigation menu',
          content: JSON.parse(
            myJSON,
            (key, value) => {
              if (key === 'icon') {
                return iconsMap[value];
              } else {
                return value;
              }
            }
          )
        }
      ];


  const {
    setSidebarToggleMobile,
    sidebarToggleMobile,
    sidebarFixed,
    sidebarHover,
    setSidebarHover,
    sidebarToggle,
    sidebarUserbox,
    sidebarShadow,
    sidebarFooter
  } = props;



  const toggleHoverOn = () => setSidebarHover(true);
  const toggleHoverOff = () => setSidebarHover(false);

  const closeDrawer = () => setSidebarToggleMobile(!sidebarToggleMobile);

  const sidebarMenuContent = (
    <div
      className={clsx({
        'app-sidebar-nav-close': sidebarToggle && !sidebarHover
      })}>
      {menu.map(list => (
        <SidebarMenu
          component="div"
          key={list.label}
          pages={list.content}
          title={list.label}
        />
      ))}
    </div>
  );

  return (
    <Fragment>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          open={sidebarToggleMobile}
          onClose={closeDrawer}
          variant="temporary"
          elevation={4}
          className="app-sidebar-wrapper-lg">
          <SidebarHeader />
          <PerfectScrollbar>
            {sidebarUserbox && <SidebarUserbox />}
            {sidebarMenuContent}
            {/* {sidebarFooter && <SidebarFooter />} */}  
          </PerfectScrollbar>
        </Drawer>
      </Hidden>

      <Hidden mdDown>
        <Paper
          onMouseEnter={toggleHoverOn}
          onMouseLeave={toggleHoverOff}
          className={clsx('app-sidebar-wrapper', {
            'app-sidebar-wrapper-close': sidebarToggle,
            'app-sidebar-wrapper-open': sidebarHover,
            'app-sidebar-wrapper-fixed': sidebarFixed
          })}
          square
          open={sidebarToggle}
          elevation={sidebarShadow ? 11 : 3}>
          <SidebarHeader />
          <div
            className={clsx({
              'app-sidebar-menu': sidebarFixed,
              'app-sidebar-collapsed': sidebarToggle && !sidebarHover
            })}>
            <PerfectScrollbar options={{ wheelPropagation: false }}>
              {sidebarUserbox && <SidebarUserbox />}
              {sidebarMenuContent}
              {/* {sidebarFooter && <SidebarFooter />} */}
            </PerfectScrollbar>
          </div>
        </Paper>
      </Hidden>
   
    </Fragment>
  );
};

const mapStateToProps = state => ({
  sidebarFixed: state.ThemeOptions.sidebarFixed,
  headerFixed: state.ThemeOptions.headerFixed,
  sidebarToggle: state.ThemeOptions.sidebarToggle,
  sidebarHover: state.ThemeOptions.sidebarHover,
  sidebarShadow: state.ThemeOptions.sidebarShadow,
  sidebarFooter: state.ThemeOptions.sidebarFooter,
  sidebarUserbox: state.ThemeOptions.sidebarUserbox,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile,
  token : state.UserData.token,
  data : state.UserData.data,
});

const mapDispatchToProps = dispatch => ({
  setSidebarToggleMobile: enable => dispatch(setSidebarToggleMobile(enable)),
  setSidebarToggle: enable => dispatch(setSidebarToggle(enable)),
  setSidebarHover: enable => dispatch(setSidebarHover(enable)),
  setSidebarFooter: enable => dispatch(setSidebarFooter(enable)),
  setSidebarUserbox: enable => dispatch(setSidebarUserbox(enable)),
  setUserData: data => dispatch(setUserData(data)),
  getUserData : data => dispatch(getUserData(data)),
  updateUserData : data => dispatch(updateUserData(data)),
  removeUserData : data => dispatch(removeUserData(data)),  
  changeOrganization : data => dispatch(changeOrganization(data)),
  getModulePermission : data => dispatch(getModulePermission(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
