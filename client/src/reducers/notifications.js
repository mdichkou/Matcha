import { GET_NOTIFICATION } from "../actions/types";

const initialState = {
  notifications: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_NOTIFICATION:
      return {
        ...state,
        notifications: payload
      };

    default:
      return state;
  }
}
