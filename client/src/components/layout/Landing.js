import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const Landing = ({ auth: { isAuthenticated, isFirstVisit } }) => {
  // Redirect to FirstVisit if firstvisit
  if (isFirstVisit) return <Redirect to="/connect" />;

  // Redirect if logged in
  if (isAuthenticated) return <Redirect to="/profiles" />;
  else return <Redirect to="/login" />;
};

Landing.propTypes = {
  auth: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Landing);
