import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Grid,
  Input,
  InputLabel,
  InputAdornment,
  FormControlLabel,
  Hidden,
  IconButton,
  Paper,
  Box,
  Typography,
  Dialog,
  Checkbox,
  Tabs,
  Tab,
  LinearProgress,
  Card,
  CardContent,
  Button,
  Tooltip,
  FormControl
} from '@material-ui/core';

import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';

import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';

import DashboardTwoToneIcon from '@material-ui/icons/DashboardTwoTone';

import avatar1 from '@assetss/images/avatars/avatar1.jpg';

import avatar2 from '@assetss/images/avatars/avatar2.jpg';

import avatar6 from '@assetss/images/avatars/avatar6.jpg';
import avatar7 from '@assetss/images/avatars/avatar7.jpg';
import hero1 from '@assetss/images/hero-bg/hero-1.jpg';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import SlidepanelNav from "../CustomComponents/SlidepanelNav.js"; 
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToPros } from '@utils/MapStateDispatchProps.js';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';


class PageTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrgIndex:0,
      selectedInst:"",
      selectedInstIndex:0,
      selectedBoard:"",
      selectedBoardIndex:0,
      selectedAcademicYear:"",
      selectedAcademicIndex:0,
      menuLevel:1,
      notificationPane:false,
      openNotification: null,
      openProfile:null,
      navPanel:false,
      AcademicBoardInfo:""
    };

  }
  onSelected = (org_index,inst,inst_index,year,year_index,board,board_index) => {
    this.props.onSelectedNav(org_index,inst,inst_index,year,year_index,board,board_index);
  }
  render(){
    const {
      pageTitleStyle,
      pageTitleBackground,
      pageTitleShadow,
      pageTitleBreadcrumb,
      pageTitleIconBox,
      pageTitleDescription
    } = this.props;
  return (
    <Fragment>
      <Paper
        square
        elevation={pageTitleShadow ? 6 : 2}
        className={clsx('app-page-title app-page-title-alt-1', pageTitleStyle, pageTitleBackground)}>
        <div>
          {pageTitleBreadcrumb && (
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              className="mb-4"
              maxItems={2}
              aria-label="breadcrumb">
              <Link color="inherit" to="#" onClick={e => e.preventDefault()}>
                Home
              </Link>
              <Link color="inherit" to="#" onClick={e => e.preventDefault()}>
                Dashboards
              </Link>
              <Link color="inherit" to="#" onClick={e => e.preventDefault()}>
                Examples
              </Link>
              <Link color="inherit" to="#" onClick={e => e.preventDefault()}>
                Pages
              </Link>
              <Typography color="textPrimary">{this.props.titleHeading}</Typography>
            </Breadcrumbs>
          )}

          <Box className="app-page-title--first">
            
            {this.props.showIcon && <Paper
                elevation={2}
                className="app-page-title--iconbox d-70 d-flex align-items-center bg-secondary justify-content-center">
                 <IconButton edge="start" color="inherit" onClick={()=>this.props.history.push("/admin/gallery")} aria-label="close">
              <CloseIcon />
            </IconButton>
              </Paper>}
          
            <div className="app-page-title--heading">
              <h1>{this.props.titleHeading}</h1>
              {/* {pageTitleDescription && (
                <div className="app-page-title--description">
                  {props.titleDescription}
                </div>
              )} */}
            </div>
          </Box>
        </div>

       
          <div className="d-flex align-items-center">
 
            <SlidepanelNav onSelected={this.onSelected} {...this.props} />
         </div>
      
      </Paper>
    </Fragment>
  );
}
}

export default connect(mapStateToProps, mapDispatchToPros)(PageTitle);
