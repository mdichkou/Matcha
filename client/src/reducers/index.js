import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import notifications from "./notifications";
import members from "./members";

export default combineReducers({
  alert,
  auth,
  profile,
  notifications,
  members
});
