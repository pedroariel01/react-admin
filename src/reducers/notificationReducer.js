import { GET_NOTIFICATIONS } from "../actionsStore/action-types/types";

const initialState = {
  notifications: [],
  totalUnview: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload.data,
        totalUnview: action.payload.total_unview
      };
    default:
      return state;
  }
}
