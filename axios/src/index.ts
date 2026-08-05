import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const axiosSécurisé = axios.create();

axiosSécurisé.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.config) {
      const { headers: _, ...leResteDeLaConfig } = error.config;
      error.config = { ...leResteDeLaConfig } as InternalAxiosRequestConfig;
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
        method: error.response.request.method,
        path: error.response.request.path,
      };
    }

    return Promise.reject(error);
  }
);

export * from 'axios';
export default axiosSécurisé;
