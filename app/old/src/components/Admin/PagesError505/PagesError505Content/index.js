import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Grid, IconButton, Button, Tooltip } from '@material-ui/core';

import svgImage8 from '@assetss/images/illustrations/505.svg';

import { NavLink as RouterLink } from 'react-router-dom';

export default function LivePreviewExample() {
  return (
    <Fragment>
      <div className="app-wrapper bg-secondary">
        <div className="app-main">
          <div className="app-content p-0">
            <div className="app-inner-content-layout--main">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--content">
                  <div className="hero-wrapper bg-composed-wrapper min-vh-100">
                    <div className="flex-grow-1 w-100 d-flex align-items-center">
                      <Grid
                        item
                        lg={6}
                        md={9}
                        className="px-4 mx-auto text-center text-black">
                        <img
                          src={svgImage8}
                          className="w-50 mx-auto d-block my-5 img-fluid"
                          alt="..."
                        />

                        <h1 className="display-1 mb-3 px-4 font-weight-bold">
                          Page is under construction
                        </h1>
                       
                        <p>
                          We are working on and will
                          be live as soon as possible.
                        </p>
                      
                      </Grid>
                    </div>
      
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
