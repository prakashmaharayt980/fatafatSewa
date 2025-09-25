// src/app/api/remoteservice.ts

import axios, { AxiosHeaders } from 'axios';


const remote = {
  address: 'https://fatafatsewa.com/api',
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

const postRequest = async (api: string, data: any) =>
  axiosInstance.post(`${remote.address}${api}`, data);

const RemoteServices = {
  SerachProducts: (data: string) =>
    getRequest(`/v1/products?name=${data}&limit=10`).then(res => res.data),
  ProductTranding: () =>
    getRequest(`/v1/products?order_by=created`).then(res => res.data),

  FilterProducts: ({slug,sort,page}) =>
    getRequest(`/get-products?category=${slug}&sorting=${sort}&page=${page}&get_filters=true`)
      .then(res => res.data),

  Categories: () =>
    getRequest(`/v1/categories?order_by=created`).then(res => res.data),
  

  CategoriesSlug: (slug: string) =>
    getRequest(`/v1/categories/${slug}`).then(res => res.data),

  ProductId: (id: string) =>
    getRequest(`/v1/products/${id}`).then(res => res.data.data),

  ProductDetailsSlug: (slug: string) =>
    getRequest(`/v1/product-detail/${slug}`).then(res => res.data.data),

  BlogsAll: () =>
    getRequest(`/v1/blogs`).then(res => res.data),
  BlogSlug: (slug:string) =>
    getRequest(`/v1/blogs/${slug}`).then(res => res.data),

  Login: (data: { email: string; password: string }) =>
    postRequest(`/v1/login`, data).then(res => res.data.data),

  Register: (data: { email: string; password: string; name: string; address: string; phone_number: string }) =>
    postRequest(`/v1/register`, data).then(res => res.data.data),

  LoginwithGoogle: (data: { id_token: string }) =>
    postRequest(`/v1/login/google`, data).then(res => res.data.data),

  ForgottenPassword: (data: { email: string }) =>
    postRequest(`/v1/forgotten-password`, data).then(res => res.data.data),

  VerifyOtp: (data: { email: string }) =>
    postRequest(`/v1/verify-otp`, data).then(res => res.data.data),

};

export default RemoteServices;
