import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { getCookie, setCookie } from "../functions";
import RefreshedTokenResponse from "./auth/models/responses/refreshedTokenResponse";

const cancelToken = axios.CancelToken.source();

const baseAxiosInstance = axios.create({
  baseURL: process.env.API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  cancelToken: cancelToken.token,
});

// add token to all requests
baseAxiosInstance.interceptors.request.use((request) => {
  const token = getCookie("token");
  if (token) request.headers["Authorization"] = "Bearer " + token;
  return request;
});

// refresh token if token has expired
let isRefreshing = false;
let failedQueue: any = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

baseAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error?.config;

    if (error?.response?.status === 401 && !request?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
          .then((token) => {
            request.headers["Authorization"] = "Bearer " + token;
            return axios(request);
          })
          .catch((err) => Promise.reject(err));
      }

      request._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        baseAxiosInstance({
          method: "GET",
          url: "Auth/",
        })
          .then((res: AxiosResponse<RefreshedTokenResponse>) => {
            const resData = res.data;
            setCookie("token", resData.token, resData.expiration);
            request.headers["Authorization"] = "Bearer " + resData.token;
            processQueue(null, resData.token);
            resolve(axios(request));
          })
          .catch((err) => {
            if (!axios.isCancel(err)) {
              processQueue(err);
              reject(err);
            }
          })
          .finally(() => (isRefreshing = false));
      });
    } else {
      const resData: ErrorResponse = error?.response?.data;
      if (resData?.detail) toast.error(resData.detail);
    }

    return Promise.reject(error);
  }
);

export { baseAxiosInstance, cancelToken };

interface ErrorResponse {
  title: string;
  detail: string;
  errors?: ValidationErrorDetails[];
  status: number;
  type: string;
}

interface ValidationErrorDetails {
  property: string;
  errors: string[];
}
