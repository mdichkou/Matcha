import axios from "axios";
import { GET_NOTIFICATION } from "./types";

// Get All Notificaiton User
export const getAllNotification = () => async dispatch => {
  const res = await axios.get("/api/notification/allnotifications");

  dispatch({
    type: GET_NOTIFICATION,
    payload: res.data
  });
};
