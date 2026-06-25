import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.config) {
      const { headers: _, ...leResteDeLaConfig } = error.config;
      error.config = { ...leResteDeLaConfig } as AxiosError['config'];
    }

    if (error.request) {
      error.request = {
        method: error.request.method,
        path: error.request.path,
      };
    }

    if (error.response?.headers) {
      const { headers: _, ...leResteDeLaReponse } = error.response;
      error.response = leResteDeLaReponse as typeof error.response;
    }

    if (error.response?.request) {
      error.response.request = {
        method: error.response.request?.method,
        path: error.response.request?.path,
      };
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
