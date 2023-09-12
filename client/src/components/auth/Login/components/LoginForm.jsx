import React from 'react';
import useStyles from '../../../../utils/styleClasses';
import { Link } from 'react-router-dom';
import { TextField, Button, Grid, Link as Mlink } from '@material-ui/core';

function LoginForm({
  onChange,
  email,
  password,
  onSubmit,
  emailError,
  passwordError,
  emailTouched,
  passwordTouched,
}) {
  const classes = useStyles();
  return (
    <form className={classes.form} onSubmit={(e) => onSubmit(e)}>
      <TextField
        error={emailError && emailTouched}
        helperText={emailError && emailTouched ? emailError : ''}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => onChange(e)}
      />
      <TextField
        error={passwordError && passwordTouched}
        helperText={passwordError && passwordTouched ? passwordError : ''}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => onChange(e)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="secondary"
        className={classes.submit}
        disabled={!email || !password}
      >
        Sign In
      </Button>
      <Grid container>
        <Grid item xs>
          <Mlink component={Link} to="/forget" variant="body2">
            Forgot password?
          </Mlink>
        </Grid>
        <Grid item>
          <Mlink component={Link} to="/register" variant="body2">
            Don't have an account? Sign Up
          </Mlink>
        </Grid>
      </Grid>
    </form>
  );
}

export default LoginForm;
