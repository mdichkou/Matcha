import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATEINFO_SUCCESS,
  UPDATEINFO_ERROR,
  UPDATEPREF_SUCCESS,
  UPDATEPREF_ERROR,
  UPDATEPWD_SUCCESS,
  UPDATEPWD_ERROR,
  FIRSTVISIT_SUCCESS,
  FIRSTVISIT_ERROR,
  SETPROFILEPIC_SUCCESS,
  SETPROFILEPIC_ERROR,
  DELETEPICTURE_SUCCESS,
  DELETEPICTURE_ERROR,
  POSITION_UPDATE,
  LIKE_SUCCESS
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: {},
  preferences: [],
  loading: true,
  edited: false
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };

    case GET_PROFILES:
      return {
        ...state,
        profiles: payload.profiles,
        preferences: payload.preferences,
        loading: false
      };

    case UPDATEPWD_SUCCESS:
      return {
        ...state,
        loading: false,
        edited: true
      };

    case FIRSTVISIT_SUCCESS:
    case UPDATEINFO_SUCCESS:
    case UPDATEPREF_SUCCESS:
    case SETPROFILEPIC_SUCCESS:
    case DELETEPICTURE_SUCCESS:
    case POSITION_UPDATE:
    case LIKE_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case PROFILE_ERROR:
    case UPDATEINFO_ERROR:
    case UPDATEPREF_ERROR:
    case UPDATEPWD_ERROR:
    case FIRSTVISIT_ERROR:
    case SETPROFILEPIC_ERROR:
    case DELETEPICTURE_ERROR:
      return {
        ...state,
        loading: false
      };

    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false
      };

    default:
      return state;
  }
}
