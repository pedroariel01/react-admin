import { apiClient } from "./httpClient";

function getLogs(nameFile, file) {
  return apiClient.get("/connectors/review/log", {
    params: { nameFile, file }
  });
}

// type_logger must be one of (parser_log, raw_data)
function getTableInfo(logger_id, type_logger) {
  return apiClient.get("/connectors/spider/table/info", {
    params: { logger_id, type_logger }
  });
}

function getLogger() {
  return apiClient.get("/connectors/logger");
}

function getSpidersConfigParams(config_name) {
  return apiClient.get("/connectors/spiders/config/params", {
    params: { config_name }
  });
}

function getAllSpiderConfigs() {
  return apiClient.get("/connectors/all/spiders/config");
}

function getAllDataOrigin() {
  return apiClient.get("/connectors/all/dataorigin");
}

function getColumnsName(table_name) {
  return apiClient.get("/connectors/all/columns/origin", {
    params: { table_name }
  });
}

function stopSpider(logger_id) {
  return apiClient.get("/connectors/stop/spider", {
    params: { logger_id }
  });
}

function restartSpider(logger_id, final_schema_name, loggerName) {
  return apiClient.get("/connectors/restart/spider", {
    params: { logger_id, final_schema_name, loggerName }
  });
}

function startMapping(logger_id) {
  return apiClient.get("/connectors/start/mapping", {
    params: { logger_id }
  });
}

export {
  getLogs,
  getLogger,
  getTableInfo,
  getSpidersConfigParams,
  getAllSpiderConfigs,
  getAllDataOrigin,
  getColumnsName,
  stopSpider,
  restartSpider,
  startMapping
};
