import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  VERIFY_SUCCESS,
  VERIFY_FAIL,
  CLEAR_PROFILE,
  RESET_PASSWORD,
  GET_TOKENRESET
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) setAuthToken(localStorage.token);

  const res = await axios.get("/api/auth");

  if (res.data.msg) dispatch({ type: AUTH_ERROR });
  else dispatch({ type: USER_LOADED, payload: res.data });
};

// Register User
export const register = ({
  firstname,
  lastname,
  email,
  username,
  password,
  password2
}) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({
    firstname,
    lastname,
    email,
    username,
    password,
    password2
  });

  const res = await axios.post("/api/users", body, config);

  const errors = res.data.errors;

  if (!errors) {
    dispatch({ type: REGISTER_SUCCESS });
    dispatch(setAlert(res.data.msg, "success"));
  } else {
    errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    dispatch({ type: REGISTER_FAIL });
  }
};

// Verfiy User
export const verify = token => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ token });

  const res = await axios.post("/api/users/verification", body, config);

  const errors = res.data.errors;

  if (!errors) {
    dispatch({ type: VERIFY_SUCCESS });
    dispatch(setAlert(res.data.msg, "success"));
  } else {
    errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    dispatch({ type: VERIFY_FAIL });
  }
};

// Login User
export const login = (username, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ username, password });

  const res = await axios.post("/api/auth", body, config);

  const errors = res.data.errors;

  if (!errors) {
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    dispatch(loadUser());
  } else {
    errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    dispatch({ type: LOGIN_FAIL });
  }
};

// Forget password
export const forget = username => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ username });

  const res = await axios.post("/api/forget", body, config);

  const errors = res.data.errors;

  if (errors) errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
  else {
    dispatch({ type: GET_TOKENRESET });
    dispatch(setAlert(res.data.msg, "success"));
  }
};

// Reset password
export const reset = (token, password, password2) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ token, password, password2 });

  const res = await axios.post("/api/forget/reset", body, config);

  const errors = res.data.errors;

  if (errors) errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
  else {
    dispatch({ type: RESET_PASSWORD });
    dispatch(setAlert(res.data.msg, "success"));
  }
};

// Logout
export const logout = () => async dispatch => {
  const res = await axios.get("/api/auth/logout");

  if (res.data.msg === "ok") {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT });
  }
};
