import { apiClient } from "./httpClient";

function database_list() {
  return apiClient.get("/connectors/databases");
}

function databaseCredentialList() {
  return apiClient.get("/connectors/database/credentials").then(res => {
    return res.data;
  });
}

function databasesFromHost(databaseCredId) {
  return apiClient({
    url: "/connectors/databasebyHost",
    method: "GET",
    params: { search: databaseCredId }
  }).then(res => {
    return res.data;
  });
}

function schemasByDatabase(databaseCredId, databasename) {
  return apiClient({
    url: "/connectors/schemasByDatabase",
    method: "GET",
    params: { databaseCredId, databasename }
  });
}

function newDatabaseCredential(dataCredential) {
  const data = {
    host: dataCredential.host.value,
    username: dataCredential.username.value,
    password: dataCredential.password.value
  };

  return apiClient.post("/connectors/credential/new", data).then(res => {
    return res;
  });
}

function updateDatabaseCredential(dataCredential) {
  const data = {
    id: dataCredential.id,
    host: dataCredential.host.value,
    username: dataCredential.username.value,
    password: dataCredential.password.value
  };

  return apiClient.post("/connectors/credential/update", data).then(res => {
    return res;
  });
}

function deleteCredential(id) {
  const data = {
    id
  };

  return apiClient.post("/connectors/credential/delete", data).then(res => {
    return res;
  });
}

function tablesBySchema(databaseCredId, databasename, schemaName) {
  return apiClient({
    url: "/connectors/tablesBySchema",
    method: "GET",
    params: { databaseCredId, databasename, schemaName }
  });
}

export {
  database_list,
  databaseCredentialList,
  newDatabaseCredential,
  updateDatabaseCredential,
  deleteCredential,
  databasesFromHost,
  schemasByDatabase,
  tablesBySchema
};
