import { apiClient } from "./httpClient";

function getManagerByClient(client_id, page = 0) {
  let pageNumb = 1;
  if(page){
    const aux  = page.match('page=([0-9]+)');
    if(aux){
      pageNumb=aux[1]
    }
  }
  return apiClient({
    url: `/connectors/client/manager?page=${pageNumb}`,
    method: "GET",
    params: { search: client_id }
  });
}

function getManagerDetail(manager_id) {
  return apiClient.get(`/connectors/manager/detail/${manager_id}`);
}

function getSchedulersByConnector(connector_id, page = 0) {
  let pageNumb = 1;
  if(page){
    const aux  = page.match('page=([0-9]+)');
    if(aux){
      pageNumb=aux[1]
    }
  }
  return apiClient({
    url: `/connectors/schedulers?page=${pageNumb}`,
    method: "GET",
    params: { search: connector_id }
  });
}

function newScheduler(dataScheduler) {
  return apiClient
    .post("/connectors/schedulers/new", dataScheduler)
    .then(res => {
      return res;
    });
}

function getScheduler(scheduler_id) {
  return apiClient.get(`/connectors/schedulers/${scheduler_id}`).then(res => {
    return res;
  });
}

function updateScheduler(scheduler_id, data_scheduler) {
  // return axios.put(`/connectors/schedulers/${scheduler_id}`, data_scheduler);
  return apiClient.post("/connectors/scheduler/update", {
    scheduler_id: scheduler_id,
    data_scheduler: data_scheduler
  });
}

function deleteScheduler(scheduler) {
  const { id } = scheduler;
  return apiClient.delete(`/connectors/schedulers/${id}`);
}

function deleteAssociation(clientConnector) {
  return apiClient.post("/connectors/delete/association", clientConnector);
}

function getSchedulerStatus() {
  return apiClient.get("/connectors/scheduler/status");
}

export {
  getManagerByClient,
  getSchedulersByConnector,
  newScheduler,
  getScheduler,
  updateScheduler,
  getManagerDetail,
  deleteScheduler,
  deleteAssociation,
  getSchedulerStatus
};
