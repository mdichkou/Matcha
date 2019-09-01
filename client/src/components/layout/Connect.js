import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../../actions/profile";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { Fab, Box } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";

const Connect = ({ getCurrentProfile, auth, profile }) => {
  useEffect(() => {
    if (auth) {
      !profile.profile && getCurrentProfile();
    }
  }, [getCurrentProfile, profile.profile, auth]);

  if (auth) {
    if (auth.isFirstVisit)
      return (
        <div>
          <Box m={8}>
            <Fab variant="extended" component={Link} to="/firstvisit">
              <NavigationIcon />
              Complete your profile before to continue
            </Fab>
          </Box>
        </div>
      );
    else return <Redirect to="/dashboard" />;
  } else {
    return <Spinner />;
  }
};

Connect.propTypes = {
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
)(Connect);
