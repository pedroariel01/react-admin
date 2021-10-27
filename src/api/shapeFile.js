import { apiClient } from "./httpClient";


function download_shapefile(dataShape) {
  const data = {
    url: dataShape.url.value,
    file_name: dataShape.file_name.value,
    data_type: dataShape.data_type.value,
    selectedLogin:dataShape.selectedLogin.label,
    limit:dataShape.limit.value,
    user_name: dataShape.user_name.value,
    code_login: dataShape.code_login.value,
    origin_url: dataShape.origin_url.value,
    min_offset: dataShape.min_offset.value,
    max_offset: dataShape.max_offset.value,
    sign_in_url: dataShape.sign_in_url.value,
    errorForm:dataShape.errorForm,
    loading:dataShape.loading,
    is_paginated: dataShape.is_paginated
  };


  // console.log(dataShape.is_paginated);

  return apiClient.post("/shapefile/", data).then(res => {
    return res;
  });
}

export {
  download_shapefile
};