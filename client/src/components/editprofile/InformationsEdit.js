import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { editInformation } from "../../actions/profile";
import useStyles from "../../utils/styleClasses";
import { CssBaseline, Grid, TextField, Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

const InformationsEdit = ({ auth: { user }, editInformation }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstname: "",
    lastname: ""
  });

  const { email, username, lastname, firstname } = formData;

  useEffect(() => {
    user &&
      setFormData({
        email: !user || !user.User[0].email ? "" : user.User[0].email,
        username: !user || !user.User[0].username ? "" : user.User[0].username,
        lastname: !user || !user.User[0].lastname ? "" : user.User[0].lastname,
        firstname:
          !user || !user.User[0].firstname ? "" : user.User[0].firstname
      });
  }, [user]);

  const profileChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    editInformation(firstname, lastname, email, username);
    window.location.reload();
  };

  return !user ? (
    <Spinner />
  ) : (
    <Fragment>
      <CssBaseline />
      <div className={classes.paperEdit}>
        <form className={classes.formEdit} onSubmit={e => onSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                variant="outlined"
                required
                fullWidth
                id="firstname"
                label="First Name"
                name="firstname"
                value={firstname}
                onChange={e => profileChange(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                variant="outlined"
                required
                fullWidth
                id="lastname"
                label="Last Name"
                name="lastname"
                value={lastname}
                onChange={e => profileChange(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={email}
                onChange={e => profileChange(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                onChange={e => profileChange(e)}
              />
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

InformationsEdit.propTypes = {
  auth: PropTypes.object.isRequired,
  editInformation: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { editInformation }
)(InformationsEdit);
