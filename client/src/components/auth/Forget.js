import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { forget } from "../../actions/auth";
import useStyles from "../../utils/styleClasses";
import { CssBaseline, Typography, TextField, Button } from "@material-ui/core";

const Forget = ({ isAuthenticated, forget, sended }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    username: ""
  });

  const { username } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    forget(username);
  };

  // Redirect if logged in
  if (isAuthenticated) return <Redirect to="/dashboard" />;

  // Rediret if sended
  if (sended) return <Redirect to="/login" />;

  return (
    <Fragment>
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <form className={classes.form} onSubmit={e => onSubmit(e)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={e => onChange(e)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
            disabled={!username}
          >
            Submit
          </Button>
        </form>
      </div>
    </Fragment>
  );
};

Forget.propTypes = {
  isAuthenticated: PropTypes.bool,
  forget: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  sended: state.auth.sended
});

export default connect(
  mapStateToProps,
  { forget }
)(Forget);
