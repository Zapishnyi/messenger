import axios, { AxiosError } from "axios";

import { baseURL, urls } from "../constants/urls";
import { navigateTo } from "../helpers/navigate-to";
import IAuthTokens from "../interfaces/IAuthTokens";
import { IHealth } from "../interfaces/IHealth";
import IUser from "../interfaces/IUser";
import IUserSignIn from "../interfaces/IUserSignIn";

import { UsersActions } from "../redux/Slices/usersSlice";

import IUserSignUp from "../interfaces/IUserSignUp";
import { store } from "../redux/store";

import IMessage from "../interfaces/IMessage";
import IUploadResponse from "../interfaces/IUploadResponse";
import { storage } from "./localStorage.service";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((request) => {
  let token: string | null;
  if (request.url === "/auth/refresh") {
    token = storage.getRefreshToken();
  } else {
    token = storage.getAccessToken();
  }
  request.headers.Authorization = `Bearer ${token}`;
  return request;
});

interface IApiService {
  auth: {
    sign_up: (body: IUserSignUp) => Promise<IAuthTokens>;
    sign_in: (body: IUserSignIn) => Promise<IAuthTokens>;
    refresh: () => Promise<IAuthTokens>;
    log_out: () => Promise<void>;
  };
  user: {
    me: () => Promise<IUser>;
    all: () => Promise<IUser[]>;
  };
  message: {
    all: (id: string) => Promise<IMessage[]>;
      file_upload: (files: FormData) => Promise<IUploadResponse>;
    file_download: (id: string) => Promise<Blob>;
  };
  health: () => Promise<IHealth>;
}

export const api: IApiService = {
  auth: {
    sign_up: (body) =>
      axiosInstance
        .post(urls.auth.sign_up, body)
        .then((response) => response.data),
    sign_in: (body) =>
      axiosInstance
        .post(urls.auth.sign_in, body)
        .then((response) => response.data),
    refresh: () =>
      axiosInstance.post(urls.auth.refresh).then((response) => response.data),
    log_out: () => axiosInstance.post(urls.auth.log_out),
  },
  user: {
    me: () => axiosInstance.get(urls.user.me).then((response) => response.data),
    all: () =>
      axiosInstance.get(urls.user.all).then((response) => response.data),
  },
  message: {
    all: (id) =>
      axiosInstance.get(urls.message.all(id)).then((response) => response.data),
       file_upload: (files) =>
      axiosInstance
        .post(urls.message.file_upload, files, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => response.data),
    file_download: (id) =>
      axiosInstance
        .get(urls.message.file_download(id), { responseType: "blob" })
        .then((response) => response.data),
  },
  health: () =>
    axiosInstance.get(urls.health).then((response) => response.data),
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const dispatch = store.dispatch;
    const originalRequest = error.config;
    if (error.status === 401) {
      if (
        !originalRequest._retry &&
        storage.getRefreshToken() &&
        originalRequest.url !== "/auth/refresh"
      ) {
        originalRequest._retry = true;
        try {
          const { tokens } = await api.auth.refresh();
          storage.setAccessToken(tokens.access);
          storage.setRefreshToken(tokens.refresh);
          return axiosInstance(originalRequest);
        } catch (error) {
          if ((error as AxiosError).response?.status === 401) {
            storage.deleteTokens();
            dispatch(UsersActions.setUser(null));
            console.error("Token refresh failed with error:", error);
            navigateTo("/auth/sign-in");
          }
        }
      } else {
        navigateTo("/auth/sign-in");
      }
    }
    return Promise.reject(error);
  }
);
