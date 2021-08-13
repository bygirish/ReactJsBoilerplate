import React, { Fragment } from 'react';

import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { IconButton, Box } from '@material-ui/core';

import { connect } from 'react-redux';

// import projectLogo from '@assetss/images/egenius_logo.png';

import {mapStateToProps , mapDispatchToPros} from '@utils/MapStateDispatchProps.js';
import Config from '../../config';
import i18n from '../../i18n';

const HeaderLogo = props => {
  const { sidebarToggle, sidebarHover } = props;
  const lang = i18n.options.lng;
  // const t = i18n.options.resources[lang].translations;
  return (
    <Fragment>
      <div
        className={clsx('app-header-logo', {
          'app-header-logo-close': sidebarToggle,
          'app-header-logo-open': sidebarHover
        })}>
        <Box
          className="header-logo-wrapper"
          title="">
          <Link to="admin/dashbaord" className="header-logo-wrapper-link">
            <IconButton
              color="primary"
              size="medium"
              className="header-logo-wrapper-btn">
              <img
                className="app-header-logo-img"
                alt=""
                src={Config.path+"writable/uploads/institute_logo/"+props.data.selectedInstitutionId+"/"+props.data.inst_logo}
              />
            </IconButton>
          </Link>
          <Box className="header-logo-text">{props.data.inst_name}</Box>
        </Box>
      </div>
    </Fragment>
  );
};

// const mapStateToProps = state => ({
//   sidebarToggle: state.ThemeOptions.sidebarToggle,
//   sidebarHover: state.ThemeOptions.sidebarHover
// });

export default connect(mapStateToProps, mapDispatchToPros)(HeaderLogo);
