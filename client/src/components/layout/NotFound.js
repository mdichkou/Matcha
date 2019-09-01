import React, { Fragment } from "react";

const NotFound = () => {
  return (
    <Fragment>
      <div className="wrapper mt-5">
        <div className="container-fluid" id="top-container-fluid-nav">
          <div className="container" />
        </div>

        <div className="container-fluid mt-5" id="body-container-fluid">
          <div className="container">
            <h1 className="display-1">
              4<i className="fa  fa-spin fa-cog fa-3x" /> 4
            </h1>
            <h1 className="display-3">ERROR</h1>
            <h4 className="lower-case">Oops! This page Could Not Be Found!</h4>
          </div>
        </div>

        <div className="container-fluid" id="footer-container-fluid">
          <div className="container" />
        </div>
      </div>
    </Fragment>
  );
};

export default NotFound;
