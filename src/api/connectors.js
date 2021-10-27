import { apiClient } from "./httpClient";

function getConnector(connector_id) {
  return apiClient.get(`/connectors/connector/${connector_id}`);
}

function getConnectors(client_id, page = 0) {
  let pageNumb = 1;
  if(page){
    const aux  = page.match('page=([0-9]+)');
    if(aux){
      pageNumb=aux[1]
    }
  }

  if (client_id) {
    return apiClient({
      url: `/connectors/all?client_id=${client_id}&page=${pageNumb}`,
      method: "GET"
    });
  } else {
    return apiClient({
      url: `/connectors/all?page=${pageNumb}`,
      method: "GET"
    });
  }
}

function getAssociationClient(client_id) {
  if (client_id) {
    return apiClient({
      url: `/connectors/client/association?search=${client_id}`,
      method: "GET"
    });
  }

  return apiClient({
    url: "/connectors/client/association",
    method: "GET"
  });
}

function buildAssociation(client_id, connector_id, filter) {
  return apiClient.post("/connectors/association/connector", {
    client_id,
    connector_id,
    filter
  });
}

function filterConnectors() {}

function getStatusConnector() {}

function updateStatusConnector() {}

export {
  getConnector,
  filterConnectors,
  getStatusConnector,
  updateStatusConnector,
  getConnectors,
  buildAssociation,
  getAssociationClient
};
