import React from "react";
import PropTypes from "prop-types";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import styleMap from "../../utils/styleMap";

const Position = ({ profile, google }) => {
  const mapStyles = {
    width: "100%",
    height: "100%"
  };

  return (
    <div className="map-responsive">
      <Map
        disableDefaultUI
        styles={styleMap}
        google={google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
          lat: profile.profileinfo[0].latitude,
          lng: profile.profileinfo[0].longitude
        }}
      >
        <Marker
          name={"Your position"}
          position={{
            lat: profile.profileinfo[0].latitude,
            lng: profile.profileinfo[0].longitude
          }}
        />
      </Map>
    </div>
  );
};

Position.propTypes = {
  profile: PropTypes.object.isRequired,
  google: PropTypes.object.isRequired
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyBZwoZjtlArLEEYsZFhS3f_YxJEDrX6km4"
})(Position);
