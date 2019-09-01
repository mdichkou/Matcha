import React, { Fragment, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import About from "./About";
import Pictures from "./Pictures";
import Position from "./Position";
import useStyles from "../../utils/styleClasses";
import {
  getProfileById,
  UnlikeUser,
  BlockUser,
  VisitUser,
  likeUser,
  reportUser
} from "../../actions/profile";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import uuid from "uuid";
import useForceUpdate from "use-force-update";
import Report from "@material-ui/icons/Report";
import moment from "moment";

const Profile = ({
  getProfileById,
  UnlikeUser,
  BlockUser,
  likeUser,
  VisitUser,
  reportUser,
  profile: { profile, loading },
  auth: { user, isFirstVisit },
  match,
  isAuthenticated
}) => {
  const classes = useStyles();

  const forceUpdate = useForceUpdate();

  const [matchData, setMatchData] = useState(false);

  const [blockedData, setBlockedData] = useState(false);

  const [likedData, setLikedData] = useState(false);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    isAuthenticated && getProfileById(match.params.id);
    user && VisitUser(match.params.id);

    user &&
      user.Match.length &&
      JSON.parse(user.Match).map(
        userid => userid === Number(match.params.id) && setMatchData(true)
      );

    user &&
      user.Block.length &&
      JSON.parse(user.Block).map(
        userid => userid === Number(match.params.id) && setBlockedData(true)
      );

    user &&
      user.UserLiked.length &&
      JSON.parse(user.UserLiked).map(
        userid => userid === Number(match.params.id) && setLikedData(true)
      );
  }, [getProfileById, match.params.id, isAuthenticated, user, VisitUser]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const unlikeClick = userid => {
    UnlikeUser(userid);
    handleClose();
    setLikedData(false);
    forceUpdate();
  };

  const BlockClick = userid => {
    BlockUser(userid);
    handleClose();
    setBlockedData(true);
    forceUpdate();
  };

  const likeClick = userid => {
    likeUser(userid);
    setLikedData(true);
    forceUpdate();
  };

  const reportClick = userid => reportUser(userid);

  if (
    user &&
    profile &&
    user.User[0].username === profile.profileinfo[0].username
  )
    return <Redirect to="/profiles" />;

  if (user && profile && blockedData) return <Redirect to="/profiles" />;

  // Redirect to FirstVisit if firstvisit
  if (isFirstVisit) return <Redirect to="/connect" />;

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {profile.LikedBy &&
            !matchData &&
            JSON.parse(profile.LikedBy).map(
              userid =>
                userid === Number(match.params.id) && (
                  <Button
                    key={uuid.v4()}
                    variant="contained"
                    color="primary"
                    className={classes.fab}
                  >
                    Alread like you
                  </Button>
                )
            )}
          <Box m={4}>
            <div className="row">
              <div className="col-lg-4">
                <div className="profile-card-4 z-depth-3">
                  <div className="card">
                    <div className="card-body text-center bg-danger rounded-top">
                      <div className="user-box">
                        <img
                          src={`/${profile.profileinfo[0].userimg}`}
                          alt="user avatar"
                          className="avatarprofil"
                        />
                      </div>
                      <h5 className="mb-1 text-white">
                        {profile.profileinfo[0].firstname}
                        {profile.profileinfo[0].lastname}
                      </h5>
                      <h6 className="text-light">
                        Age: {profile.profileinfo[0].age}
                      </h6>
                      <h6 className="mt-1 text-white">
                        <IconButton
                          color="inherit"
                          onClick={() => reportClick(match.params.id)}
                        >
                          <Report />
                        </IconButton>
                      </h6>
                      <h6 className="text-white">
                        {profile.profileinfo[0].isOnline ? (
                          <Fragment>
                            <button
                              className="btn-floating btn-dark-green btn-sm"
                              disabled
                            >
                              User is online
                            </button>
                          </Fragment>
                        ) : (
                          <span className="text-white" disabled>
                            Last visit:
                            {moment(profile.profileinfo[0].logout_at).format(
                              "DD MMMM HH:mm"
                            )}
                          </span>
                        )}
                      </h6>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="list-group shadow-none">
                      <li className="list-group-item">
                        <div className="list-icon">
                          <i className="fa fa-user" />
                        </div>
                        <div className="list-details">
                          <span>{profile.profileinfo[0].username}</span>
                          <small>Username</small>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="list-icon">
                          <i className="fa fa-phone-square" />
                        </div>
                        <div className="list-details">
                          <span>{profile.profileinfo[0].phone}</span>
                          <small>Mobile Number</small>
                        </div>
                      </li>
                    </ul>
                    <div className="row text-center mt-4">
                      <div className="col p-2">
                        <small className="mb-0 font-weight-bold">Ratings</small>
                        <Rating value={profile.finalRating} readOnly />
                      </div>

                      {likedData || matchData ? (
                        matchData ? (
                          <Fragment>
                            <div className="col p-2">
                              <IconButton
                                color="secondary"
                                onClick={handleClickOpen}
                                className="badge badge-danger badge-pill"
                              >
                                <i className="fas fa-heart" />
                              </IconButton>
                              <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>More Actions</DialogTitle>
                                <DialogContent dividers>
                                  <IconButton
                                    color="secondary"
                                    className="badge badge-danger badge-pill m-2"
                                    onClick={() => unlikeClick(match.params.id)}
                                  >
                                    <i className="fas fa-heart-broken" />
                                  </IconButton>
                                  <IconButton
                                    color="secondary"
                                    className="badge badge-danger badge-pill m-2"
                                    onClick={() => BlockClick(match.params.id)}
                                  >
                                    <i className="fas fa-ban" />
                                  </IconButton>
                                  <DialogActions>
                                    <Button
                                      onClick={handleClose}
                                      color="inherit"
                                    >
                                      Cancel
                                    </Button>
                                  </DialogActions>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </Fragment>
                        ) : (
                          <Fragment>
                            <div className="col p-2">
                              <IconButton
                                color="secondary"
                                onClick={() => unlikeClick(match.params.id)}
                                className="badge badge-danger badge-pill"
                              >
                                <i className="fas fa-heart-broken" />
                              </IconButton>
                            </div>
                            <div className="col p-2">
                              <IconButton
                                color="secondary"
                                className="badge badge-danger badge-pill"
                                onClick={() => BlockClick(match.params.id)}
                              >
                                <i className="fas fa-ban" />
                              </IconButton>
                            </div>
                          </Fragment>
                        )
                      ) : (
                        <Fragment>
                          <div className="col p-2">
                            <IconButton
                              color="secondary"
                              className="badge badge-light badge-pill"
                              onClick={() => likeClick(match.params.id)}
                            >
                              <i className="fas fa-heart" />
                            </IconButton>
                          </div>
                          <div className="col p-2">
                            <IconButton
                              color="secondary"
                              className="badge badge-danger badge-pill"
                              onClick={() => BlockClick(match.params.id)}
                            >
                              <i className="fas fa-ban" />
                            </IconButton>
                          </div>
                        </Fragment>
                      )}
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
                        <About profile={profile} />
                      </div>
                      <div className="tab-pane" id="pictures">
                        <Pictures profile={profile} />
                      </div>
                      <div className="tab-pane" id="position">
                        <Position profile={profile} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  UnlikeUser: PropTypes.func.isRequired,
  BlockUser: PropTypes.func.isRequired,
  VisitUser: PropTypes.func.isRequired,
  likeUser: PropTypes.func.isRequired,
  reportUser: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  auth: PropTypes.object
};

const mapStateToProps = state => ({
  profile: state.profile,
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProfileById, UnlikeUser, BlockUser, VisitUser, likeUser, reportUser }
)(Profile);
