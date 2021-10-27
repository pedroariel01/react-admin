import axios from "axios";

/**
 * Axios common configuration
 */
const config = {};

const configAssessor = {};

//Create axios with initial config
const apiClient = axios.create(config);

const apiClientAssessor = axios.create(configAssessor);

// const serverAresAddr = 'https://192.81.135.92:8000';

// @permission_classes((IsAuthenticated, ))

const authInterceptor = config => {
  const token = localStorage.getItem("jwtToken");
  // config.url  = serverAresAddr + config.url;
  // console.log(config.headers);
  config.headers.Authorization = "JWT " + token;
  return config;
};

const authAssessorInterceptor = configAssessor => {
  configAssessor.headers.Authorization = 'Bearer 3772bbcd739e97f17a7fb4b0c39ba3a97b531ec5';
  return configAssessor;
};

apiClientAssessor.interceptors.request.use(authAssessorInterceptor);

apiClient.interceptors.request.use(authInterceptor);


apiClient.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("jwtToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);



apiClientAssessor.interceptors.response.use(
    function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    console.log(error);
    if (error.response.status === 401) {
      localStorage.removeItem("jwtToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }

);

const serverAddr = 'http://45.33.62.162:8002';

// const serverAddr = 'http://127.0.0.1:8000';

export { apiClient, apiClientAssessor,serverAddr};
