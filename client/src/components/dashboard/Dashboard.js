import React, { Fragment, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import About from "./About";
import Pictures from "./Pictures";
import Position from "./Position";
import { getCurrentProfile } from "../../actions/profile";
import { Box } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";

const Dashboard = ({
  getCurrentProfile,
  auth: { user, isFirstVisit },
  profile: { profile, loading }
}) => {
  useEffect(() => {
    !profile && getCurrentProfile();
  }, [getCurrentProfile, profile]);

  if (isFirstVisit) return <Redirect to="/firstvisit" />;

  return !user ? (
    <Spinner />
  ) : loading && !profile ? (
    <Spinner />
  ) : (
    <Fragment>
      <Box m={4}>
        <div className="row">
          <div className="col-lg-4">
            <div className="profile-card-4 z-depth-3">
              <div className="card">
                <div className="card-body text-center bg-danger rounded-top">
                  <div className="user-box">
                    {!profile ? (
                      <Spinner />
                    ) : (
                      <img
                        src={profile.profileimg}
                        alt="user avatar"
                        className="avatarprofil"
                      />
                    )}
                  </div>
                  <h5 className="mb-1 text-white">
                    {user && user.User[0].firstname}{" "}
                    {user && user.User[0].lastname}
                  </h5>
                  <h6 className="text-light">Age: {profile && profile.age}</h6>
                </div>
              </div>
              <div className="card-body">
                <ul className="list-group shadow-none">
                  <li className="list-group-item">
                    <div className="list-icon">
                      <i className="fa fa-user" />
                    </div>
                    <div className="list-details">
                      <span>{user && user.User[0].username}</span>
                      <small>Username</small>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="list-icon">
                      <i className="fa fa-phone-square" />
                    </div>
                    <div className="list-details">
                      <span>{profile && profile.phone}</span>
                      <small>Mobile Number</small>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="list-icon">
                      <i className="fa fa-envelope" />
                    </div>
                    <div className="list-details">
                      <span>{user && user.User[0].email}</span>
                      <small>Email Address</small>
                    </div>
                  </li>
                </ul>
                <div className="row text-center mt-4">
                  <div className="col p-2">
                    <small className="mb-0 font-weight-bold">Ratings</small>
                    <Rating value={user.finalRating} readOnly />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card z-depth-3 mt-4">
              <div className="card-body">
                <ul className="nav nav-pills nav-pills-danger nav-justified">
                  <li className="nav-item">
                    <Link
                      to="#about"
                      data-target="#about"
                      data-toggle="pill"
                      className="nav-link active show"
                    >
                      <span className="hidden-xs">About</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="#pictures"
                      data-target="#pictures"
                      data-toggle="pill"
                      className="nav-link"
                    >
                      <span className="hidden-xs">Pictures</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="#position"
                      data-target="#position"
                      data-toggle="pill"
                      className="nav-link"
                    >
                      <i className="icon-note" />
                      <span className="hidden-xs">Position</span>
                    </Link>
                  </li>
                </ul>
                <div className="tab-content p-3">
                  <div className="tab-pane active show" id="about">
                    <About />
                  </div>
                  <div className="tab-pane" id="pictures">
                    <Pictures />
                  </div>
                  <div className="tab-pane" id="position">
                    <Position />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Dashboard);
