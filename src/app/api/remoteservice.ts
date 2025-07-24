// src/app/api/remoteservice.ts

import axios, { AxiosHeaders } from 'axios';

const remote = {
  address: 'https://fatafatsewa.com/api/v1',
  ApiKey: 'pk_live_ObeGTVPwD6F3XqRZ79M4JxOMEpg5Vrtg',
};

const axiosInstance = axios.create();

// Interceptor to inject API-Key safely
axiosInstance.interceptors.request.use(
  config => {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    if (config.headers instanceof AxiosHeaders) {
      config.headers.set('API-Key', remote.ApiKey);
    } else {
      (config.headers as any)['API-Key'] = remote.ApiKey;
    }

    return config;
  },
  error => Promise.reject(error)
);

const getRequest = async (api: string) =>
  axiosInstance.get(`${remote.address}${api}`);

const RemoteServices = {
  SerachProducts: (data: string) =>
    getRequest(`/products?name=${data}&limit=10`).then(res => res.data),

  Categories: () =>
    getRequest(`/categories`).then(res => res.data),

  ProductId: (id: string) =>
    getRequest(`/products/${id}`).then(res => res.data.data),
};

export default RemoteServices;
