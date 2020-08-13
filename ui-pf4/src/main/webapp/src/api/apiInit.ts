import axios from "axios";

export const API_BASE_URL = "/mta-web/api";

export const initApi = () => {
  axios.defaults.baseURL = `${API_BASE_URL}`;
};

export const initInterceptors = (getToken: () => string | undefined) => {
  axios.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = "Bearer " + getToken();
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
};
