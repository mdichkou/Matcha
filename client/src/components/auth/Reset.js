import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { reset } from "../../actions/auth";
import queryString from "query-string";
import useStyles from "../../utils/styleClasses";
import {
  CssBaseline,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  Box
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const Reset = ({ isAuthenticated, reset, history, reseted }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    password: "",
    password2: "",
    token: undefined,
    showPassword: false
  });

  const { password, password2, token, showPassword } = formData;

  useEffect(() => {
    const { token } = queryString.parse(history.location.search);

    setFormData({ token });
  }, [history]);

  const ClickshowPassword = () =>
    setFormData({ ...formData, showPassword: !showPassword });

  const passwordChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    reset(token, password, password2);
  };

  // Redirect if logged in
  if (isAuthenticated) return <Redirect to="/dashboard" />;

  // Redirect after Reset Success
  if (reseted) return <Redirect to="/login" />;

  return (
    <Fragment>
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <form className={classes.form} onSubmit={e => onSubmit(e)}>
          <Box m={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="password"
                  label="New Password"
                  fullWidth
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password || ""}
                  onChange={e => passwordChange(e)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={ClickshowPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="password2"
                  label="New Password Again"
                  fullWidth
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  name="password2"
                  value={password2 || ""}
                  onChange={e => passwordChange(e)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={ClickshowPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              disabled={!password || !password2}
            >
              Submit
            </Button>
          </Box>
        </form>
      </div>
    </Fragment>
  );
};

Reset.propTypes = {
  isAuthenticated: PropTypes.bool,
  reset: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  reseted: state.auth.reseted
});

export default connect(
  mapStateToProps,
  { reset }
)(Reset);
