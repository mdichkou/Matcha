import axios from "axios";
import { GET_MEMBERS } from "./types";

// Get All User Chat
export const getAllMembers = () => async dispatch => {
  const res = await axios.get("http://localhost:5000/api/chat/members");

  dispatch({
    type: GET_MEMBERS,
    payload: res.data
  });
};
