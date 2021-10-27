import { GET_NOTIFICATIONS, GET_ERRORS } from "./action-types/types";
import { apiClient } from "../api/httpClient";

export const notificationsUnView = () => dispatch => {
  apiClient
    .get("/connectors/notifications/unview")
    .then(e =>
      dispatch({
        type: GET_NOTIFICATIONS,
        payload: e.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: null
      })
    );
};
