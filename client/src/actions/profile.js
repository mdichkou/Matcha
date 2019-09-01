import axios from "axios";
import { socket } from "../components/chat/Socket";
import { loadUser } from "./auth";
import { setAlert } from "./alert";
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
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
  CLEAR_PROFILE,
  POSITION_UPDATE,
  LIKE_SUCCESS
} from "./types";

// Get current users profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch {
    dispatch({
      type: PROFILE_ERROR
    });
  }
};

// Update position user
export const updatePos = (latitude, longitude) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ latitude, longitude });

  await axios.post("/api/profile/positionupdate", body, config);
};

// Update position user manually
export const sendPosition = (latitude, longitude) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ latitude, longitude });

  const res = await axios.post("/api/profile/customposition", body, config);

  dispatch({ type: POSITION_UPDATE });
  dispatch(setAlert(res.data.msg, "success"));
};

// Get all profiles
export const getProfiles = () => async dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get("/api/profile");

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch {
    dispatch({
      type: PROFILE_ERROR
    });
  }
};

// Get profile  by ID
export const getProfileById = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch {
    dispatch({
      type: PROFILE_ERROR
    });
  }
};

// FristVisit User Information
export const firstVisitUpdate = (
  age,
  bdate,
  phone,
  gender,
  sexualpref,
  bio,
  tags
) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({
    age,
    bdate,
    phone,
    gender,
    sexualpref,
    bio,
    tags
  });

  const res = await axios.post("/api/profile/firstvisit", body, config);

  const errors = res.data.errors;
  if (!errors) {
    dispatch({ type: FIRSTVISIT_SUCCESS });
    dispatch(setAlert(res.data.msg, "success"));
  } else {
    errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    dispatch({ type: FIRSTVISIT_ERROR });
  }
};

// Edit User Information
export const editInformation = (
  firstname,
  lastname,
  email,
  username
) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ firstname, lastname, email, username });

  const res = await axios.post("/api/profile/editinformation", body, config);

  const errors = res.data.errors;
  if (!errors) {
    dispatch({ type: UPDATEINFO_SUCCESS });
    dispatch(loadUser());
    dispatch(setAlert(res.data.msg, "success"));
  } else {
    errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    dispatch({ type: UPDATEINFO_ERROR });
  }
};

// Edit User Preferences
export const editPreferences = (
  age,
  bdate,
  phone,
  gender,
  sexualpref,
  bio,
  tags,
  editPosition
) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({
    age,
    bdate,
    phone,
    gender,
    sexualpref,
    bio,
    tags,
    editPosition
  });

  const res = await axios.post("/api/profile/editpreferences", body, config);

  const errors = res.data.errors;
  if (!errors) {
    dispatch({ type: UPDATEPREF_SUCCESS });
    dispatch(setAlert(res.data.msg, "success"));
  } else {
    errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    dispatch({ type: UPDATEPREF_ERROR });
  }
};

// Edit User Password
export const editPassword = (
  oldpassword,
  newpassword,
  newpassword2
) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({
    oldpassword,
    newpassword,
    newpassword2
  });

  const res = await axios.post("/api/profile/editpassword", body, config);

  const errors = res.data.errors;
  if (!errors) {
    dispatch({ type: UPDATEPWD_SUCCESS });
    dispatch(setAlert(res.data.msg, "success"));
  } else {
    errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    dispatch({ type: UPDATEPWD_ERROR });
  }
};

// Set Profile Picture
export const setProfilPic = (oldimgid, newimgid) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({
    oldimgid,
    newimgid
  });

  const res = await axios.post("/api/images/setprofilpic", body, config);

  const errors = res.data.errors;

  !errors
    ? dispatch({ type: SETPROFILEPIC_SUCCESS })
    : dispatch({ type: SETPROFILEPIC_ERROR });

  dispatch(setAlert(res.data.msg, "success"));
};

// Delete Picture
export const deletePic = imgid => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ imgid });

  const res = await axios.post("/api/images/delete", body, config);

  const errors = res.data.errors;

  !errors
    ? dispatch({ type: DELETEPICTURE_SUCCESS })
    : dispatch({ type: DELETEPICTURE_ERROR });
};

// Like User
export const likeUser = userid => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ userid });

  const res = await axios.post("/api/match", body, config);

  const notification = {
    id: userid,
    msg: res.data.msg2
  };

  socket.emit("send_not", notification);

  dispatch({ type: LIKE_SUCCESS });

  dispatch(setAlert(res.data.msg, "success"));
};

// Unlike User
export const UnlikeUser = userid => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ userid });

  const res = await axios.post("/api/match/unlike", body, config);

  const notification = {
    id: userid,
    msg: res.data.msg2
  };

  socket.emit("send_not", notification);

  dispatch(setAlert(res.data.msg, "success"));
};

// Block User
export const BlockUser = userid => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ userid });

  const res = await axios.post("/api/match/block", body, config);

  dispatch(setAlert(res.data.msg, "success"));
};

// Visit User
export const VisitUser = userid => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ userid });

  const res = await axios.post("/api/visit", body, config);

  const notification = {
    id: userid,
    msg: res.data.msg
  };

  socket.emit("send_not", notification);
};

// Update Position Auto
export const getPosition = () => async dispatch => {
  await axios.get("/api/profile/getposition");
};

// Update Preferences
export const updatePreferences = (
  age_min,
  age_max,
  rating_min,
  rating_max,
  distance_max,
  tags_match
) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({
    age_min,
    age_max,
    rating_min,
    rating_max,
    distance_max,
    tags_match
  });

  const res = await axios.post("/api/profile/preferences", body, config);

  const errors = res.data.errors;

  if (errors) errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
};

// Update filter
export const updateFilter = target => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ target });

  await axios.post("/api/profile/filter", body, config);
};

// Reposer user
export const reportUser = userid => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ userid });

  const res = await axios.post("/api/profile/report", body, config);

  dispatch(setAlert(res.data.msg, "success"));
};
