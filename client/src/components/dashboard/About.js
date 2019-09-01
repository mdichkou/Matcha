import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import Select from "react-select";

const About = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading }
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  const customStyles = {
    multiValueRemove: base => ({ ...base, display: "none" })
  };

  return (
    <Fragment>
      <div className="row mb-3">
        <div className="col-md-6">
          <span className="font-weight-bold text-primary">Gender</span>
        </div>
        <div className="col-md-6">
          <p className="font-weight-bolder">{profile && profile.gender}</p>
        </div>
        <div className="col-md-6">
          <span className="font-weight-bold text-primary">Looking for</span>
        </div>
        <div className="col-md-6">
          <p className="font-weight-bolder">{profile && profile.sexualpref}</p>
        </div>
        <div className="col-md-6">
          <span className="font-weight-bold text-primary">Your Bio</span>
        </div>
        <div className="col-md-6">
          <p className="font-weight-bolder">{profile && profile.bio}</p>
        </div>
        <div className="col-md-11">
          <span className="font-weight-bold text-primary">Your tags</span>
          <br />
          {profile && profile.tags && (
            <Select
              isMulti
              value={JSON.parse(profile.tags).map(tag => ({
                label: tag,
                value: tag
              }))}
              isClearable={false}
              isDisabled={true}
              styles={customStyles}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

About.propTypes = {
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
)(About);
