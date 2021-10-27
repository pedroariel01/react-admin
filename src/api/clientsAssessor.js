import { apiClientAssessor,serverAddr } from "./httpClient";

function clientsAssessor() {
  return apiClientAssessor.get(`${serverAddr}/assessor/clients`).then(res => {
      // console.log(res);
    return res.data;
  });
}


function getClient(id) {
  return apiClientAssessor.get(`${serverAddr}/assessor/clients/${id}`).then(res => {

      return res.data;
  });
}

function getAllClientData(id) {

   var client_data = {};
   const getAllData = async() =>{
       await apiClientAssessor.get(`${serverAddr}/assessor/clients/${id}`).then(res => {
           client_data['client'] = res.data;
       });

       await apiClientAssessor.get(`${serverAddr}/assessor/clients/${id}/schemas`).then(res => {
          client_data['schemas']= res.data;
       });

       await apiClientAssessor.get(`${serverAddr}/assessor/clients/${id}/data_origins`).then(res => {
              client_data['data_origins']= res.data;

           });
       await apiClientAssessor.get(`${serverAddr}/assessor/clients/${id}/tasks`).then(res => {
                  client_data['tasks']= res.data;

               });
       return client_data;

   };
   return getAllData();

}



function newAssessorClient(name,country,state,county,config,is_scraping){

  const data =
      {
        name:name,
        country:country,
        state:state,
        county:county,
        assessor_config:config,
          scraping:is_scraping
      };
  return apiClientAssessor.post(`${serverAddr}/assessor/clients/`, data).then(res => {
    return res;
  });
}

function getNextRunList(){

    return apiClientAssessor.get(`${serverAddr}/assessor/assessor_task/next_running/`).then(res => {
      // console.log(res);
    return res.data;
  });
}

function getSchemas(state='', county=''){

        let data =
            {
                country: 'us'
            };
        if(state){
            data.state=state;
        }
        if(county){
            data.county = county
        }

        return apiClientAssessor.get(`${serverAddr}/assessor/schemas`).then(
            res=>{
                return res.data}
        )
}


function newConsolidationSchema(data_origin,data_origin_field,schema_1,schema_2,schema_name){
    const data= {
            schemas_to_merge:[schema_1,schema_2],
            schema_result:schema_name,
        data_origin:data_origin,
        data_origin_field:data_origin_field
    };
    return apiClientAssessor.post(`${serverAddr}/admin/consolidation`, data).then(res => {
    return res;
  });
}

function newAssessorTask(name,interval,client,enab,oneOff,task_type){
    const data = {
        name:name,
        interval:interval,
        client:client,
        enabled:enab,
        one_off:oneOff,
        task:task_type

    };
    return apiClientAssessor.post(`${serverAddr}/assessor/assessor_task/`, data).then(res => {

        return res;
      });

}

function newAssessorDataOrigin(name,field,client,layer,extract) {
    const data = {
        name:name,
        field:field,
        layer:layer,
        client:client,
        extract:extract
    };
    // console.log(data);

    return apiClientAssessor.post(`${serverAddr}/assessor/data_origin/`, data).then(res => {

        return res;
      });

}

function getIntervals(){
    return apiClientAssessor.get(`${serverAddr}/assessor/schedule`).then(res => {
    return res;
  });
}

function getTaskType(){
    return apiClientAssessor.get(`${serverAddr}/assessor/assessor_task/tasks/`).then(res => {
    return res.data;
  });
}

function getTaskResult(){
     return apiClientAssessor.get(`${serverAddr}/assessor/task_result_ext/root/`).then(res => {
    return res.data.results;
  });
}

async function   getTaskResultData(id){
    return await apiClientAssessor.get(`${serverAddr}/assessor/task_result_ext/${id}`).then(res=>{
        return res;
    })
}

function getTaskResultDataFamily(id){
    return apiClientAssessor.get(`${serverAddr}/assessor/task_result_ext/${id}/family`).then(res => {
    return res;
  });
}

function getSchema(id){
    return apiClientAssessor.get(`${serverAddr}/assessor/schemas/${id}`).then(res => {
    return res;
  });
}

function getTasks(){
    return apiClientAssessor.get(`${serverAddr}/assessor/assessor_task`).then(res => {
    return res;
  });
}



function updateClient(id, client) {
  return apiClientAssessor.put(`/connectors/client/${id}`, client).then(res => {
    return res;
  });
}

function deleteClient(client) {
  const { id } = client;
  return apiClientAssessor.delete(`/connectors/client/${id}`);
}




function getDataOrigins(){
  return apiClientAssessor.get(`${serverAddr}/assessor/data_origin`).then(res => {
    return res.data;
  });
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
  return apiClientAssessor.get("/connectors/run/spider", {
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

function getCounties(stateName){
  return apiClientAssessor.get(`${serverAddr}/assessor/available/us/${stateName}`).then(res => {
    if(Array.isArray( res.data)){
        return {data:res.data,is_array:true};
    }

    return {data:Object.keys(res.data), is_array:false};
  });
}

function getConfigsAssesor(stateName,configName){
  return apiClientAssessor.get(`${serverAddr}/assessor/available/us/${stateName}/${configName}`).then(res => {

    return res.data;
  });
}

function getCountries() {
    return apiClientAssessor.get(`${serverAddr}/assessor/available/`).then(res => {

    return Object.keys(res.data);
  });
}

function getStates(state = 'us'){
  return apiClientAssessor.get(`${serverAddr}/assessor/available/${state}`).then(res => {

    if(Array.isArray( res.data)){
        return {data:res.data,is_array:true};
    }

    return {data:Object.keys(res.data), is_array:false};
  });
}





function getDataOriginFields(dataOriginName){
    return apiClientAssessor.post(`${serverAddr}/assessor/data_origins/columns`,
        {data_origin_table:dataOriginName}).then(res => {
            return res.data;
          });
}

function getConfigs(name) {
  return apiClientAssessor.get("/connectors/configs", {
    params: { name }
  });
}

export {
  clientsAssessor,
  deleteClient,
  updateClient,
  getClient,
  runSpider,
  getConfigs,
  getDataOrigins,
  getDataOriginFields,
    getAllClientData,
  getCounties,
    getStates,
    getConfigsAssesor,
    newAssessorClient,
    getIntervals,
    getTaskType,
    newAssessorTask,
    getTaskResult,
    getTasks,
    getTaskResultData,
    newAssessorDataOrigin,
    getNextRunList,
    getSchemas,
    getSchema,getCountries,
    getTaskResultDataFamily,
    newConsolidationSchema
};
