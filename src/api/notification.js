import { apiClient } from "./httpClient";

function notifications() {
  return apiClient.get("/connectors/notifications").then(res => {
    return res.data;
  });
}

function notificationsUnView() {
  return apiClient.get("/connectors/notifications/unview").then(res => {
    return res.data;
  });
}

function reviewNotification(id) {
  return apiClient
    .post("/connectors/notifications/review", { notificationId: id })
    .then(res => {
      return res;
    });
}

export { notifications, notificationsUnView, reviewNotification };
