import { apiClient,serverAddr } from "./httpClient";



function getAssessor(connector_id) {
  return apiClient.get(`/connectors/connector/${connector_id}`);
}

function getAssessors(client_id) {
  if (client_id) {
    return apiClient({
      url: `/connectors/all?client_id=${client_id}`,
      method: "GET"
    });
  } else {
    return apiClient({
      url: `/connectors/all`,
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
  getAssessor,
  filterConnectors,
  getStatusConnector,
  updateStatusConnector,
  getAssessors,
  buildAssociation,
  getAssociationClient
};
