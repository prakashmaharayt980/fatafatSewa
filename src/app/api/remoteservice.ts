// src/app/api/remoteservice.ts

import axios, { AxiosHeaders } from 'axios';

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

// Fix: Safely inject API-Key using .set()
axiosInstance.interceptors.request.use(
  config => {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set('API-Key', remote.ApiKey);
    } else if (config.headers) {
      // fallback for plain object headers
      (config.headers as any)['API-Key'] = remote.ApiKey;
    } else {
      config.headers = new AxiosHeaders({ 'API-Key': remote.ApiKey });
    }
    return config;
  },
  error => Promise.reject(error)
);

const getRequest = async (api: string) =>
  axiosInstance.get(`${remote.address}${api}`, {
    headers: requestHeaders(),
  });

const RemoteServices = {
  SerachProducts: (data: string) =>
    getRequest(`/products?name=${data}&limit=10`).then(res => res.data),

  Categories: () =>
    getRequest(`/categories`).then(res => res.data),

  ProductId: (id: string) =>
    getRequest(`/products/${id}`).then(res => res.data.data),
};

export default RemoteServices;
