import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem";
import {
  getProfiles,
  updatePreferences,
  updateFilter
} from "../../actions/profile";
import uuid from "uuid";
import useStyles from "../../utils/styleClasses";
import {
  Fab,
  Slide,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Container,
  Slider,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import CloseIcon from "@material-ui/icons/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Profiles = ({
  getProfiles,
  updatePreferences,
  updateFilter,
  profile: { profiles, loading, preferences },
  auth: { user, isFirstVisit }
}) => {
  const classes = useStyles();

  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  const [open, setOpen] = useState(false);

  const [openFilter, setOpenFilter] = useState(false);

  const [openSelect, setopenSelect] = useState(false);

  const [sorting, setSorting] = useState("");

  const [agemin, setAgeMin] = useState();

  const [agemax, setAgeMax] = useState();

  const [ratingmin, setRatingMin] = useState();

  const [ratingmax, setRatingMax] = useState();

  const [distance, setDistance] = useState();

  const [tags, setTags] = useState();

  const ageChangeMin = (event, newAge) => setAgeMin(newAge);

  const agechangeMax = (event, newAge) => setAgeMax(newAge);

  const ratingChangeMin = (event, newRating) => setRatingMin(newRating);

  const ratingChangeMax = (event, newRating) => setRatingMax(newRating);

  const distanceChange = (event, newDistance) => setDistance(newDistance);

  const tagsChange = (event, newTags) => setTags(newTags);

  const handleClickOpen = () => setOpen(true);

  const filterClickOpen = () => setOpenFilter(true);

  const handleClose = () => setOpen(false);

  const filterClose = () => setOpenFilter(false);

  const selectClose = () => setopenSelect(false);

  const selectOpen = () => setopenSelect(true);

  const selectChange = e => setSorting(e.target.value);

  const filterSave = () => {
    updateFilter(sorting);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    filterClose(false);
  };

  const handleSave = () => {
    let {
      age_min,
      age_max,
      rating_min,
      rating_max,
      distance_max,
      tags_max
    } = 0;

    agemin === undefined
      ? (age_min = preferences[0].age_min)
      : (age_min = agemin);

    agemax === undefined
      ? (age_max = preferences[0].age_max)
      : (age_max = agemax);

    ratingmin === undefined
      ? (rating_min = preferences[0].rating_min)
      : (rating_min = ratingmin);

    ratingmax === undefined
      ? (rating_max = preferences[0].rating_max)
      : (rating_max = ratingmax);

    distance === undefined
      ? (distance_max = preferences[0].distance_max)
      : (distance_max = distance);

    tags === undefined
      ? (tags_max = preferences[0].tags_match)
      : (tags_max = tags);

    updatePreferences(
      age_min,
      age_max,
      rating_min,
      rating_max,
      distance_max,
      tags_max
    );
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    setOpen(false);
  };

  let profile = [];

  if (profiles && profiles.length > 0) {
    for (let p = 0; p < profiles.length; p++) {
      profiles[p].map(value => profile.push(value));
    }
  }

  // Redirect to FirstVisit if firstvisit
  if (isFirstVisit) return <Redirect to="/connect" />;

  return (
    <Fragment>
      {!user || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h2 className="mt-4 pb-3 font-weight-bold card-title">
            Choose your life companion
          </h2>
          <Fab color="secondary" onClick={handleClickOpen}>
            <SearchIcon />
          </Fab>
          <Fab color="secondary" onClick={filterClickOpen}>
            <FilterListIcon />
          </Fab>

          <div className="row mt-4">
            {profile.length > 0 ? (
              profile.map(profile => (
                <div key={uuid.v4()} className="col-md-4 mx-auto">
                  <ProfileItem key={profile.id} profile={profile} />
                </div>
              ))
            ) : (
              <h2>No Profile Found ...</h2>
            )}
          </div>
          {preferences && preferences.length > 0 && (
            <Fragment>
              <Dialog
                fullWidth
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
              >
                <AppBar color="inherit" className={classes.appBarSearch}>
                  <Toolbar>
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={handleClose}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.titleSearch}>
                      Profiles Filter
                    </Typography>
                    <Button color="inherit" onClick={handleSave}>
                      Save
                    </Button>
                  </Toolbar>
                </AppBar>
                <Box m={2}>
                  <Container>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" gutterBottom>
                          Age Min:
                        </Typography>
                        <Slider
                          value={agemin}
                          defaultValue={preferences[0].age_min}
                          min={13}
                          max={99}
                          onChange={ageChangeMin}
                          valueLabelDisplay="auto"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" gutterBottom>
                          Age Max:
                        </Typography>
                        <Slider
                          value={agemax}
                          defaultValue={preferences[0].age_max}
                          min={13}
                          max={99}
                          onChange={agechangeMax}
                          valueLabelDisplay="auto"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" gutterBottom>
                          Rating Min:
                        </Typography>
                        <Slider
                          value={ratingmin}
                          defaultValue={preferences[0].rating_min}
                          min={0}
                          max={10}
                          onChange={ratingChangeMin}
                          valueLabelDisplay="auto"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" gutterBottom>
                          Rating Max:
                        </Typography>
                        <Slider
                          value={ratingmax}
                          defaultValue={preferences[0].rating_max}
                          min={0}
                          max={10}
                          onChange={ratingChangeMax}
                          valueLabelDisplay="auto"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Typography variant="body1" gutterBottom>
                          Maximum distance:
                        </Typography>
                        <Slider
                          defaultValue={preferences[0].distance_max}
                          value={distance}
                          onChange={distanceChange}
                          step={1}
                          min={1}
                          max={199}
                          valueLabelDisplay="auto"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Typography variant="body1" gutterBottom>
                          Tags Match:
                        </Typography>
                        <Slider
                          defaultValue={preferences[0].tags_match}
                          value={tags}
                          onChange={tagsChange}
                          step={1}
                          min={0}
                          max={5}
                          valueLabelDisplay="auto"
                        />
                      </Grid>
                    </Grid>
                  </Container>
                </Box>
              </Dialog>
              <Dialog
                fullWidth
                open={openFilter}
                onClose={filterClose}
                TransitionComponent={Transition}
              >
                <AppBar color="inherit" className={classes.appBarSearch}>
                  <Toolbar>
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={filterClose}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography variant="h6">Sort By</Typography>
                    <FormControl className={classes.titleSearch}>
                      <Select
                        open={openSelect}
                        onClose={selectClose}
                        onOpen={selectOpen}
                        value={sorting}
                        onChange={selectChange}
                        displayEmpty
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="age">Age</MenuItem>
                        <MenuItem value="distance">Distance</MenuItem>
                        <MenuItem value="rating">Rating</MenuItem>
                        <MenuItem value="tags">Tags Match</MenuItem>
                      </Select>
                    </FormControl>
                    <Button color="inherit" onClick={filterSave}>
                      Save
                    </Button>
                  </Toolbar>
                </AppBar>
              </Dialog>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  updatePreferences: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
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
  { getProfiles, updatePreferences, updateFilter }
)(Profiles);
