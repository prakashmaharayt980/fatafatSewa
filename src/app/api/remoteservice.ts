// src/app/api/remoteservice.ts

import axios, { AxiosHeaders } from 'axios';
import { Filter } from 'lucide-react';

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
  ProductTranding: () =>
    getRequest(`/products?order_by=-created`).then(res => res.data),

  // FilterProducts: (data: Filter) =>
  //   getRequest(`/products?category=${data.category}&sort=${data.sort}&limit=${data.limit}&page=${data.page}`)
  //     .then(res => res.data),

  Categories: () =>
    getRequest(`/categories?order_by=created`).then(res => res.data),

  CategoriesSlug: (slug: string) =>
    getRequest(`/categories/${slug}`).then(res => res.data),

  ProductId: (id: string) =>
    getRequest(`/products/${id}`).then(res => res.data.data),

  ProductDetailsSlug: (slug: string) =>
    getRequest(`/products-details/${slug}`).then(res => res.data.data),

  BlogsAll: () =>
    getRequest(`/blogs`).then(res => res.data.data),

  BlogSlug: (slug: string) =>
    getRequest(`/blogs/${slug}`).then(res => res.data.data),

};

export default RemoteServices;
