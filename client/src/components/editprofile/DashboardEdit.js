import React, { Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import InformationsEdit from "./InformationsEdit";
import PreferencesEdit from "./PreferencesEdit";
import PasswordEdit from "./PasswordEdit";
import Spinner from "../layout/Spinner";

const DashboardEdit = ({ auth: { user, isFirstVisit } }) => {
  if (isFirstVisit) return <Redirect to="/firstvisit" />;

  return !user ? (
    <Spinner />
  ) : user.User[0].isFirstVisit ? (
    <Redirect to="/firstvisit" />
  ) : (
    <Fragment>
      <div className="row">
        <div className="col-lg-12">
          <div className="card z-depth-3 mt-4">
            <div className="card-body">
              <ul className="nav nav-pills nav-pills-danger nav-justified">
                <li className="nav-item">
                  <Link
                    to="#informations"
                    data-target="#informations"
                    data-toggle="pill"
                    className="nav-link active show"
                  >
                    <span className="hidden-xs">Informations</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="#preferences"
                    data-target="#preferences"
                    data-toggle="pill"
                    className="nav-link"
                  >
                    <span className="hidden-xs">Preferences</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="#password"
                    data-target="#password"
                    data-toggle="pill"
                    className="nav-link"
                  >
                    <i className="icon-note" />
                    <span className="hidden-xs">Password</span>
                  </Link>
                </li>
              </ul>
              <div className="tab-content p-3">
                <div className="tab-pane active show" id="informations">
                  <InformationsEdit />
                </div>
                <div className="tab-pane" id="preferences">
                  <PreferencesEdit />
                </div>
                <div className="tab-pane" id="password">
                  <PasswordEdit />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

DashboardEdit.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(DashboardEdit);
