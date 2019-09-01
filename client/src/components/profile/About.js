import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const customStyles = {
  multiValueRemove: base => ({ ...base, display: "none" })
};

const About = ({ profile }) => {
  return (
    <Fragment>
      <div className="row mb-3">
        <div className="col-md-6">
          <span className="font-weight-bold text-primary">Gender</span>
        </div>
        <div className="col-md-6">
          <p className="font-weight-bolder">{profile.profileinfo[0].gender}</p>
        </div>
        <div className="col-md-6">
          <span className="font-weight-bold text-primary">Looking for</span>
        </div>
        <div className="col-md-6">
          <p className="font-weight-bolder">
            {profile.profileinfo[0].sexualpref}
          </p>
        </div>
        <div className="col-md-6">
          <span className="font-weight-bold text-primary">Your Bio</span>
        </div>
        <div className="col-md-6">
          <p className="font-weight-bolder">{profile.profileinfo[0].bio}</p>
        </div>
        <div className="col-md-11">
          <span className="font-weight-bold text-primary">Your tags</span>
          <br />

          <Select
            isMulti
            value={JSON.parse(profile.profileinfo[0].tags).map(tag => ({
              label: tag,
              value: tag
            }))}
            isClearable={false}
            isDisabled={true}
            styles={customStyles}
          />
        </div>
      </div>
    </Fragment>
  );
};

About.propTypes = {
  profile: PropTypes.object.isRequired
};

export default About;
