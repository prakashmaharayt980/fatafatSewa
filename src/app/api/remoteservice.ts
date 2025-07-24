import axios from 'axios';

const remote = {
  address: "https://fatafatsewa.com/api/v1",
  ApiKey: "pk_live_ObeGTVPwD6F3XqRZ79M4JxOMEpg5Vrtg",
};

const requestHeaders = (isFormData = false) => {
  return {
    'API-Key': remote.ApiKey,
    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    Accept: 'application/json',
  };
};

const axiosInstance = axios.create();

// Always inject API key header
axiosInstance.interceptors.request.use(
  config => {
    config.headers = {
      ...config.headers,
      'API-Key': remote.ApiKey,
    };
    return config;
  },
  error => Promise.reject(error)
);

// Generic wrappers
const getRequest = async (api: string) =>
  axiosInstance.get(`${remote.address}${api}`, { headers: requestHeaders() });



// RemoteServices
const RemoteServices = {
   SerachProducts:(data:string)=> getRequest(`/products?name=${data}&limit=10`).then(response =>  response.data),
   Categories:()=> getRequest(`/categories`).then(response => response.data),
   ProductId:(id:string)=> getRequest(`/products/${id}`).then(response => response.data.data),
};

export default RemoteServices;