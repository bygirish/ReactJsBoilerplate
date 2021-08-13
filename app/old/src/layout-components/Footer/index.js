import React, { Fragment } from 'react';

import clsx from 'clsx';

import { Paper} from '@material-ui/core';

import { connect } from 'react-redux';

const Footer = props => {
  const { footerShadow, sidebarToggle, footerFixed } = props;
  return (
    <Fragment>
      <Paper
        square
        elevation={footerShadow ? 11 : 2}
        className={clsx('app-footer text-black-50', {
          'app-footer--fixed': footerFixed,
          'app-footer--fixed__collapsed': sidebarToggle
        })}>
        <div className="app-footer--inner">
          
          <div className="app-footer--second">
            <span> <a href="https://egenius.in" title="eGenius CAAS">
              eGenius CAAS
            </a></span> ©
            2021 - made with <span className="text-danger px-1">❤</span> for better administration
           
          </div>
        </div>
      </Paper>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  footerFixed: state.ThemeOptions.footerFixed,
  footerShadow: state.ThemeOptions.footerShadow,
  sidebarToggle: state.ThemeOptions.sidebarToggle
});
export default connect(mapStateToProps)(Footer);
