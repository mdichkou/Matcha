import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import styleMap from "../../utils/styleMap";
import { updatePos, sendPosition, getPosition } from "../../actions/profile";
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Button,
  Box
} from "@material-ui/core";
import useStyles from "../../utils/styleClasses";
import EditIcon from "@material-ui/icons/Edit";

const Position = ({
  auth: { user },
  google,
  updatePos,
  sendPosition,
  getPosition,
  profile
}) => {
  const classes = useStyles();

  const [posData, setPosData] = useState({
    latitude: "",
    longitude: ""
  });

  const [open, setOpen] = useState(false);

  const { latitude, longitude } = posData;

  useEffect(() => {
    if (profile) {
      if (!latitude && !longitude) {
        if (profile.editPosition) {
          if (user.User[0].latitude && user.User[0].longitude) {
            setPosData({
              ...posData,
              latitude: user.User[0].latitude,
              longitude: user.User[0].longitude
            });
          } else {
            getPosition();
            window.location.reload();
          }
        } else {
          navigator.geolocation.getCurrentPosition(
            pos => {
              setPosData({
                ...posData,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
              });
            },
            () => {
              getPosition();
              if (!user.User[0].latitude && !user.User[0].longitude)
                window.location.reload();
              else
                setPosData({
                  ...posData,
                  latitude: user.User[0].latitude,
                  longitude: user.User[0].longitude
                });
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          );
        }
      } else updatePos(latitude, longitude);
    } else window.location.reload();
  }, [
    latitude,
    longitude,
    profile,
    posData,
    user.User,
    updatePos,
    getPosition
  ]);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  };

  const onChange = e =>
    setPosData({ ...posData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    sendPosition(latitude, longitude);
    handleClose();
    window.location.reload();
  };

  const mapStyles = {
    width: "100%",
    height: "100%"
  };

  return (
    <Fragment>
      {profile && profile.editPosition ? (
        <Fragment>
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.fabmap}
            size="small"
            onClick={handleClickOpen}
          >
            <EditIcon />
          </Fab>

          <Dialog fullWidth open={open} onClose={handleClose}>
            <DialogTitle id="addpic">Enter your Custom Position</DialogTitle>
            <DialogContent>
              <Box m={2}>
                <form onSubmit={e => onSubmit(e)}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Latitude"
                        value={latitude}
                        type="number"
                        variant="outlined"
                        name="latitude"
                        onChange={e => onChange(e)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Longitude"
                        value={longitude}
                        type="number"
                        variant="outlined"
                        name="longitude"
                        onChange={e => onChange(e)}
                        fullWidth
                      />
                    </Grid>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="secondary"
                      disabled={!longitude || !latitude}
                    >
                      Save
                    </Button>
                  </Grid>
                </form>
              </Box>
            </DialogContent>
          </Dialog>
        </Fragment>
      ) : (
        <span />
      )}

      <div className="map-responsive">
        {latitude && longitude && (
          <Map
            disableDefaultUI
            styles={styleMap}
            google={google}
            zoom={14}
            style={mapStyles}
            initialCenter={{
              lat: latitude,
              lng: longitude
            }}
          >
            <Marker
              name={"Your position"}
              position={{
                lat: latitude,
                lng: longitude
              }}
            />
          </Map>
        )}
      </div>
    </Fragment>
  );
};

Position.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  google: PropTypes.object.isRequired,
  updatePos: PropTypes.func.isRequired,
  sendPosition: PropTypes.func.isRequired,
  getPosition: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile.profile
});

const pos = compose(
  connect(
    mapStateToProps,
    { updatePos, sendPosition, getPosition }
  ),
  GoogleApiWrapper({
    apiKey: "AIzaSyBZwoZjtlArLEEYsZFhS3f_YxJEDrX6km4"
  })
);

export default pos(Position);
