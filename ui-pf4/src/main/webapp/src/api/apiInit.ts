import axios from "axios";

export const API_BASE_URL = "/windup-ui/api";

export const initApi = () => {
  axios.defaults.baseURL = `${API_BASE_URL}`;
};

export const initInterceptors = (getToken: () => Promise<string>) => {
  axios.interceptors.request.use(
    async (config) => {
      const token = await getToken();
      if (!config.headers) config.headers = {};
      if (token) config.headers["Authorization"] = "Bearer " + token;
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
};
