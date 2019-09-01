import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { verify } from "../../actions/auth";
import queryString from "query-string";

const Verify = ({ verify, isAuthenticated, history }) => {
  const [verified, verifiedSet] = useState(false);

  useEffect(() => {
    const { token } = queryString.parse(history.location.search);

    verify(token);
    verifiedSet(true);
  }, [verify, history]);

  // Redirect if logged in
  if (isAuthenticated) return <Redirect to="/dashboard" />;

  return verified && <Redirect to="/login" />;
};

Verify.propTypes = {
  verify: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { verify }
)(Verify);
