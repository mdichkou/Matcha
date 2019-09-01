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
  GET_TOKENRESET,
  RESET_PASSWORD,
  FIRSTVISIT_SUCCESS
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
  isFirstVisit: true,
  sended: false,
  reseted: false
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
        isFirstVisit: payload.User[0].isFirstVisit
      };

    case FIRSTVISIT_SUCCESS:
      return {
        ...state,
        isFirstVisit: false
      };

    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };

    case RESET_PASSWORD:
      localStorage.removeItem("token");
      return {
        ...state,
        reseted: true
      };

    case GET_TOKENRESET:
      localStorage.removeItem("token");
      return {
        ...state,
        sended: true
      };

    case REGISTER_SUCCESS:
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case VERIFY_SUCCESS:
    case VERIFY_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };

    default:
      return state;
  }
}
