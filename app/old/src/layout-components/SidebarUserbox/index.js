import React, { Fragment } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../utils/MapStateDispatchProps.js';
import {
  Avatar,
  Box,
} from '@material-ui/core';

// import avatar2 from '../../assets/images/avatars/avatar2.jpg';

const SidebarUserbox = props => {
  const { sidebarToggle, sidebarHover } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const matches = props.data.usertype === "student" ? (props.data.name+' '+props.data.middle_name+' '+props.data.last_name).match(/\b(\w)/g): (props.data.first_name+' '+props.data.middle_name+' '+props.data.last_name).match(/\b(\w)/g); 
  const acronym = matches.join('');

  function openUserMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <Fragment>
      <Box
      onClick={()=> window.location.href="admin/my-profile"}
        className={clsx('app-sidebar-userbox', {
          'app-sidebar-userbox--collapsed': sidebarToggle && !sidebarHover
        })}>
         <Avatar
          alt={props.data.usertype === "student" ? props.data.name+' '+props.data.middle_name+' '+props.data.last_name: props.data.first_name+' '+props.data.middle_name+' '+props.data.last_name}
          className="app-sidebar-userbox-avatar"
        >{acronym.toUpperCase()}</Avatar>
        <Box className="app-sidebar-userbox-name">
          <Box>
            <b style={{textTransform:'capitalize'}}>{props.data.usertype === "student" ? props.data.name+' '+props.data.middle_name+' '+props.data.last_name: props.data.first_name+' '+props.data.middle_name+' '+props.data.last_name}</b>
          </Box>
          <Box className="app-sidebar-userbox-description">
            UID: {props.data.UID}
          </Box>
          {/* <Box className="app-sidebar-userbox-btn-profile">
            <Button
              size="small"
              color="secondary"
              variant="contained"
              className="text-white"
              href="/PagesProfile">
              View profile
            </Button>
          </Box> */}
        </Box>
      </Box>
    </Fragment>
  );
};

// const mapStateToProps = state => ({
//   sidebarToggle: state.ThemeOptions.sidebarToggle,
//   sidebarHover: state.ThemeOptions.sidebarHover
// });

export default connect(mapStateToProps, mapDispatchToPros)(SidebarUserbox);
