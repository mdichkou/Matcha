import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import LocationOn from "@material-ui/icons/LocationOn";
import PlayArrow from "@material-ui/icons/PlayArrow";

const ProfileItem = ({
  profile: { id, username, age, bio, tags, profileimg, distance }
}) => {
  return (
    <Fragment>
      <div className="card mb-5 card-cascade wider">
        <div className="view view-cascade overlay">
          <img className="w-100" src={profileimg} alt="avataruser" />
        </div>

        <div className="card-body card-body-cascade text-center pb-0">
          <h4 className="card-title">
            <strong>{username}</strong>
          </h4>
          <h6 className="pink-text pb-2">
            <strong>{`${age} years`}</strong>
          </h6>
          <p className="card-text">{bio}</p>
          <IconButton aria-label="go" component={Link} to={`/profile/${id}`}>
            <PlayArrow />
          </IconButton>
          <div className="card-footer text-muted text-center">
            <IconButton disabled={true} size="small">
              {distance} KM
              <LocationOn />
            </IconButton>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
