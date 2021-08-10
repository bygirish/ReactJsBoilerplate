import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import {mapStateToProps , mapDispatchToPros} from '../../utils/MapStateDispatchProps.js';
import {
  Avatar,
  Box,
  Badge,
  Menu,
  Button,
  List,
  ListItem,
  Tooltip,
  Divider
} from '@material-ui/core';

import avatar4 from '../../assets/images/avatars/avatar4.jpg';
import { withStyles } from '@material-ui/core/styles';

const StyledBadge = withStyles({
  badge: {
    backgroundColor: 'var(--success)',
    color: 'var(--success)',
    boxShadow: '0 0 0 2px #fff',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
})(Badge);
  const HeaderUserbox = props => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const matches = props.data.usertype == "student" ? (props.data.name+' '+props.data.middle_name+' '+props.data.last_name).match(/\b(\w)/g): (props.data.first_name+' '+props.data.middle_name+' '+props.data.last_name).match(/\b(\w)/g); 
  const acronym = matches.join('');

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const Logout = () => {
    props.removeUserData();
    window.location.href = "/login";
  }

  return (
    <Fragment>
      <Button
        color="inherit"
        onClick={handleClick}
        className="text-capitalize px-3 text-left btn-inverse d-flex align-items-center">
        <Box>
          <StyledBadge
            overlap="circle"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            variant="dot">
            <Avatar size="44"
          alt={props.data.usertype == "student" ? props.data.name+' '+props.data.middle_name+' '+props.data.last_name: props.data.first_name+' '+props.data.middle_name+' '+props.data.last_name}
          className="app-sidebar-userbox-avatar"
        >{acronym.toUpperCase()}</Avatar>
          </StyledBadge>
        </Box>
        <div className="d-none d-xl-block pl-3">
          <div className="font-weight-bold pt-2 line-height-1">
          {props.data.usertype == "student" ? props.data.name+' '+props.data.middle_name+' '+props.data.last_name: props.data.first_name+' '+props.data.middle_name+' '+props.data.last_name}
          </div>
   
        </div>
        <span className="pl-1 pl-xl-3">
          <FontAwesomeIcon icon={['fas', 'angle-down']} className="opacity-5" />
        </span>
      </Button>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        onClose={handleClose}
        className="ml-2">
        <div className="dropdown-menu-right dropdown-menu-lg overflow-hidden p-0">
          <List className="text-left bg-transparent d-flex align-items-center flex-column pt-0">
            {/* <Box>
              <StyledBadge
                overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                variant="dot">
                <Avatar sizes="44" alt="Dustin Watson" src={avatar4} />
              </StyledBadge>
            </Box> */}
            {/* <div className="pl-3 ">
              <div className="font-weight-bold text-center pt-2 line-height-1">
              {props.data.name}
              </div>
              <span className="text-black-50 text-center">
               UID: {props.data.UID}
              </span>
            </div>
            <Divider className="w-100 mt-2" /> */}
            {/* <ListItem button>My Account</ListItem> */}
            <ListItem button onClick={()=> window.location.href="admin/my-profile"}>My Account</ListItem>
            <ListItem button>Change Password</ListItem>
            <ListItem button onClick={()=>Logout()}>Logout</ListItem>
           
          </List>
        </div>
      </Menu>
    </Fragment>
  );
}
export default connect(mapStateToProps, mapDispatchToPros)(HeaderUserbox);