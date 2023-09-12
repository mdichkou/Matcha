import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { login } from '../../../actions/auth';
import useStyles from '../../../utils/styleClasses';
import { CssBaseline, Avatar, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LoginForm from './components/LoginForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Login = ({ login, isAuthenticated }) => {
  const classes = useStyles();

  const LoginFormValidation = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(5, 'password must to be at least 5 charachters')
      .max(20, 'password must to be less than 20 charachters')
      .required('password is required'),
  });

  const formik = useFormik({
    initialValues: {
        email: '',
        password: '',
    },
    validationSchema: LoginFormValidation,
    onSubmit: ({ email, password }) => {
        login(email, password);
    }
  });

  // Redirect if logged in
  if (isAuthenticated) return <Redirect to="/connect" />;

  return (
    <Fragment>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <LoginForm
          onSubmit={formik.handleSubmit}
          onChange={formik.handleChange}
          email={formik.values.email}
          password={formik.values.password}
          emailError={formik.errors.email}
          passwordError={formik.errors.password}
          emailTouched={formik.touched.email}
          passwordTouched={formik.touched.password}
        />
      </div>
    </Fragment>
  );
};

login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
