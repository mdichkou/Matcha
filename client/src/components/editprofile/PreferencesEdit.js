import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getCurrentProfile } from "../../actions/profile";
import InputMask from "react-input-mask";
import moment from "moment";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { editPreferences } from "../../actions/profile";
import useStyles from "../../utils/styleClasses";
import {
  CssBaseline,
  Grid,
  InputLabel,
  Input,
  Button,
  Switch
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

const PreferencesEdit = ({
  getCurrentProfile,
  profile: { profile, loading },
  auth: { user },
  editPreferences
}) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    age: "",
    bdate: "",
    phone: "",
    gender: "",
    sexualpref: "",
    bio: "",
    editPosition: false,
    tags: [],
    defaultTags: []
  });

  const {
    bdate,
    phone,
    gender,
    sexualpref,
    bio,
    tags,
    defaultTags,
    editPosition
  } = formData;

  useEffect(() => {
    !profile && getCurrentProfile();

    profile &&
      setFormData({
        age: !profile || !profile.age ? "" : profile.age,
        bdate: !profile || !profile.bdate ? "" : profile.bdate,
        phone: !profile || !profile.phone ? "" : profile.phone,
        gender: !profile || !profile.gender ? "" : profile.gender,
        sexualpref: !profile || !profile.sexualpref ? "" : profile.sexualpref,
        bio: !profile || !profile.bio ? "" : profile.bio,
        editPosition: !profile || !profile.editPosition ? true : false,
        tags:
          !profile || !profile.tags
            ? []
            : JSON.parse(profile.tags).map(tag => ({
                label: tag,
                value: tag
              })),
        defaultTags:
          !user || !user.Tags
            ? []
            : JSON.parse(user.Tags).map(tag => ({
                label: tag,
                value: tag
              }))
      });
  }, [getCurrentProfile, profile, user]);

  const phoneChange = e =>
    setFormData({ ...formData, phone: e.target.value.split(" ").join("") });

  const dateChange = e => setFormData({ ...formData, bdate: e.target.value });

  const genderChange = e => setFormData({ ...formData, gender: e.value });

  const sexualChange = e => setFormData({ ...formData, sexualpref: e.value });

  const bioChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const tagsChange = tags => setFormData({ ...formData, tags });

  const handleSelected = e =>
    setFormData({
      ...formData,
      editPosition: e.target.checked
    });

  const onSubmit = e => {
    e.preventDefault();
    const age = moment().diff(moment(bdate, "DD/MM/YYYY").format(), "years");
    editPreferences(
      age,
      bdate,
      phone,
      gender,
      sexualpref,
      bio,
      tags.map(value => value.value),
      editPosition
    );
    window.location.reload();
  };

  const optionsGender = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ];

  const optionsSexualOrientation = [
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "both", label: "Both" }
  ];

  return !profile ? (
    <Spinner />
  ) : (
    <Fragment>
      <CssBaseline />
      <div className={classes.paperEdit}>
        <form className={classes.formEdit} onSubmit={e => onSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputLabel htmlFor="PhoneNumber">Phone Number</InputLabel>
              <InputMask
                mask="+212 9 99 99 99 99"
                maskChar=" "
                value={phone}
                onChange={e => phoneChange(e)}
                className="form-control"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel htmlFor="bdate">Birthday Date</InputLabel>
              <InputMask
                mask="99/99/9999"
                maskChar=" "
                value={bdate}
                onChange={e => dateChange(e)}
                className="form-control"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel htmlFor="gender">Gender</InputLabel>
              {gender && (
                <Select
                  defaultValue={{
                    label: gender,
                    value: gender
                  }}
                  options={optionsGender}
                  onChange={e => genderChange(e)}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel htmlFor="sexualPref">Looking for</InputLabel>
              {sexualpref && (
                <Select
                  defaultValue={{
                    label: sexualpref,
                    value: sexualpref
                  }}
                  options={optionsSexualOrientation}
                  onChange={e => sexualChange(e)}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputLabel htmlFor="bio">Biography</InputLabel>
              <Input
                autoComplete="fname"
                required
                fullWidth
                id="bio"
                name="bio"
                value={bio}
                onChange={e => bioChange(e)}
                multiline={true}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputLabel htmlFor="tags">Your tags</InputLabel>
              <CreatableSelect
                isMulti
                onChange={tagsChange}
                options={defaultTags}
                value={tags}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputLabel htmlFor="tags">
                Choose Position Automatically
              </InputLabel>
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Off</Grid>
                <Grid item>
                  <Switch
                    checked={editPosition}
                    onChange={handleSelected}
                    value="editPosition"
                    color="primary"
                  />
                </Grid>
                <Grid item>On</Grid>
              </Grid>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            fullWidth
            color="secondary"
            type="submit"
            className={classes.submit}
          >
            <SaveIcon />
            Save
          </Button>
        </form>
      </div>
    </Fragment>
  );
};

PreferencesEdit.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  editPreferences: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, editPreferences }
)(PreferencesEdit);
