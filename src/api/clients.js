import { apiClient } from "./httpClient";

function clients(page=0) {
  let pageNumb = 1;
  if(page){
    const aux  = page.match('page=([0-9]+)')
    if(aux){
      pageNumb=aux[1]
    }
  }
  return apiClient.get(`/connectors/clients?page=${pageNumb}`).then(res => {
    return res.data;
  });
}

function newClient(dataClient) {
  const data = {
    name: dataClient.name.value,
    description: dataClient.description.value,
    confluence_pages_urls: dataClient.confluence_pages_urls.value
  };

  return apiClient.post("/connectors/clients", data).then(res => {
    return res;
  });
}

function getClient(id) {
  return apiClient.get(`/connectors/client/${id}`).then(res => {
    return res;
  });
}

function updateClient(id, client) {
  return apiClient.put(`/connectors/client/${id}`, client).then(res => {
    return res;
  });
}

function deleteClient(client) {
  const { id } = client;
  return apiClient.delete(`/connectors/client/${id}`);
}

function getConnectors(client_id) {
  return apiClient({
    url: `/connectors/client/connector`,
    method: "GET",
    params: { search: client_id }
  });
}

function getClientNote(client_id) {
  return apiClient.get("/connectors/notes", { params: { search: client_id } });
}

function newClientNote(client_id, note) {
  return apiClient.post("/connectors/notes", { client: client_id, note });
}

// DEPTH_PRIORITY,
//       AUTOTHROTTLE_TARGET_CONCURRENCY,
//       AUTOTHROTTLE_START_DELAY

function runSpider(
  data_origin,
  data_final_schema,
  config_name,
  column_origin,
  log_name,
  concurrent_request,
  download_delay,
  enabledProxy,
  AUTOTHROTTLE_ENABLED,
  RANDOM_UA_PER_PROXY,
  AUTOTHROTTLE_DEBUG,
  ROBOTSTXT_OBEY,
  PROXYMESH_TIMEOUT,
  DEPTH_PRIORITY,
  AUTOTHROTTLE_TARGET_CONCURRENCY,
  AUTOTHROTTLE_START_DELAY,
  middlewareList
) {
  return apiClient.get("/connectors/run/spider", {
    params: {
      data_origin,
      data_final_schema,
      config_name,
      column_origin,
      log_name,
      concurrent_request,
      download_delay,
      enabledProxy,
      AUTOTHROTTLE_ENABLED,
      RANDOM_UA_PER_PROXY,
      AUTOTHROTTLE_DEBUG,
      ROBOTSTXT_OBEY,
      PROXYMESH_TIMEOUT,
      DEPTH_PRIORITY,
      AUTOTHROTTLE_TARGET_CONCURRENCY,
      AUTOTHROTTLE_START_DELAY,
      middlewareList
    }
  });
}

function getConfigs(name) {
  return apiClient.get("/connectors/configs", {
    params: { name }
  });
}

export {
  clients,
  newClient,
  getConnectors,
  deleteClient,
  updateClient,
  getClient,
  getClientNote,
  newClientNote,
  runSpider,
  getConfigs
};
