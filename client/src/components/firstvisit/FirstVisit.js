import React, { Fragment, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import {
  CssBaseline,
  Grid,
  Box,
  Typography,
  Divider,
  InputLabel,
  Input,
  Button
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import useStyles from "../../utils/styleClasses";
import InputMask from "react-input-mask";
import moment from "moment";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { firstVisitUpdate } from "../../actions/profile";

// FilePond
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginFileEncode
);

const FirstVisit = ({
  auth: { loading, user, token, isFirstVisit },
  firstVisitUpdate
}) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    bdate: "",
    phone: "",
    gender: "",
    sexualpref: "",
    bio: "",
    tag: [],
    defaultTags: []
  });

  const { bdate, phone, gender, sexualpref, bio, tags, defaultTags } = formData;

  useEffect(() => {
    loading || !user.Tags
      ? setFormData({ defaultTags: [] })
      : setFormData({
          defaultTags: JSON.parse(user.Tags).map(tag => ({
            label: tag,
            value: tag
          }))
        });
  }, [user, loading]);

  const phoneChange = e =>
    setFormData({ ...formData, phone: e.target.value.split(" ").join("") });

  const dateChange = e => setFormData({ ...formData, bdate: e.target.value });

  const genderChange = e => setFormData({ ...formData, gender: e.value });

  const sexualChange = e => setFormData({ ...formData, sexualpref: e.value });

  const bioChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const tagsChange = tags => setFormData({ ...formData, tags });

  const onSubmit = e => {
    e.preventDefault();
    const age = moment().diff(moment(bdate, "DD/MM/YYYY").format(), "years");
    firstVisitUpdate(
      age,
      bdate,
      phone,
      gender,
      sexualpref,
      bio,
      tags.map(value => value.value)
    );
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

  if (!isFirstVisit) return <Redirect to="/dashboard" />;

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Box m={4}>
        <CssBaseline />
        <Typography variant="h4" component="h5">
          Profile
        </Typography>
        <Divider />
        <form className={classes.formEdit} onSubmit={e => onSubmit(e)}>
          <div className={classes.paperEdit}>
            <div className="row">
              <div className="col-lg-4">
                <div className="profile-card-4 z-depth-3">
                  <div className="card">
                    <div className="card-body">
                      <FilePond
                        required={true}
                        allowDrop={true}
                        allowMultiple={false}
                        maxFileSize={4000000}
                        acceptedFileTypes={["image/*"]}
                        allowFileEncode={true}
                        labelIdle='Drag & Drop your picture or <span class="filepond--label-action">Browse</span>'
                        name="profilpic"
                        server={{
                          url: "/api/images/profilpic",
                          process: {
                            headers: {
                              "x-auth-token": token
                            },
                            method: "POST"
                          }
                        }}
                        allowRevert={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="card z-depth-3 card-mt">
                  <div className="card-body">
                    <div className={classes.paperEdit}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <InputLabel htmlFor="PhoneNumber">
                            Phone Number
                          </InputLabel>
                          <InputMask
                            mask="+212 9 99 99 99 99"
                            maskChar=" "
                            value={phone || ""}
                            onChange={e => phoneChange(e)}
                            className="form-control"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <InputLabel htmlFor="bdate">Birthday Date</InputLabel>
                          <InputMask
                            mask="99/99/9999"
                            maskChar=" "
                            value={bdate || ""}
                            onChange={e => dateChange(e)}
                            className="form-control"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <InputLabel htmlFor="gender">Gender</InputLabel>
                          <Select
                            defaultValue={{
                              label: gender,
                              value: gender
                            }}
                            options={optionsGender}
                            onChange={e => genderChange(e)}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <InputLabel htmlFor="sexualPref">
                            Looking for
                          </InputLabel>
                          <Select
                            defaultValue={{
                              label: sexualpref,
                              value: sexualpref
                            }}
                            options={optionsSexualOrientation}
                            onChange={e => sexualChange(e)}
                          />
                        </Grid>
                        <Grid item xs={12}>
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
                        <Grid item xs={12}>
                          <InputLabel htmlFor="tags">Your tags</InputLabel>
                          <CreatableSelect
                            isMulti
                            onChange={tagsChange}
                            options={defaultTags}
                            value={tags}
                          />
                        </Grid>
                      </Grid>
                      <Button
                        variant="contained"
                        fullWidth
                        color="secondary"
                        type="submit"
                        className={classes.submit}
                        disabled={
                          !phone ||
                          !bdate ||
                          !gender ||
                          !sexualpref ||
                          !bio ||
                          !tags
                        }
                      >
                        <SaveIcon />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Box>
    </Fragment>
  );
};

FirstVisit.propTypes = {
  auth: PropTypes.object.isRequired,
  firstVisitUpdate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { firstVisitUpdate }
)(FirstVisit);
