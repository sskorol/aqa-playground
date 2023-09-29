import axios from 'axios';
import authStore from '../stores/AuthStore';
import { BE_URL } from '../constants';
import { AxiosRequestConfigExt } from '../types/AxiosRequestConfigExt';
import jwtDecode from 'jwt-decode';

const api = axios.create({
  baseURL: BE_URL,
});

let refreshAttempts = 0;
const refreshEndpoint = '/auth/refresh';

const isTokenExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (ignored) {
    return false;
  }
};

api.interceptors.request.use(
  (config: AxiosRequestConfigExt) => {
    if (config && !config.isPublic) {
      const token = authStore.accessToken;
      const headers = config.headers;
      if (token && headers) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    if (response.config.url && !response.config.url.endsWith(refreshEndpoint)) {
      refreshAttempts = 0;
    }
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    const refreshToken = authStore.refreshToken;

    // If error is not 401 or the request was for the refresh endpoint.
    if (
      error.response.status !== 401 ||
      originalConfig.url.endsWith(refreshEndpoint)
    ) {
      return Promise.reject(error);
    }

    // Check if token is expired and if we've attempted to refresh it.
    if (!isTokenExpired(authStore.accessToken) || refreshAttempts >= 1) {
      authStore.logout();
      return Promise.reject(error);
    }

    refreshAttempts++;

    try {
      const { data } = await api.post(refreshEndpoint, { refreshToken });
      authStore.setAccessToken(data.accessToken);
      return api(originalConfig);
    } catch (refreshError) {
      authStore.logout();
      return Promise.reject(refreshError);
    }
  },
);

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const refreshToken = authStore.refreshToken;
//     const refreshEndpoint = '/auth/refresh';
//     if (
//       error.response.status === 401 &&
//       !error.config.url.endsWith(refreshEndpoint) &&
//       refreshToken &&
//       !isRefreshing &&
//       refreshAttempts < 3
//     ) {
//       isRefreshing = true;
//       try {
//         const { data } = await api.post(refreshEndpoint, { refreshToken });
//         authStore.setAccessToken(data.accessToken);
//         isRefreshing = false;
//         return api.request(error.config);
//       } catch (refreshError) {
//         refreshAttempts++;
//         isRefreshing = false;
//         authStore.logout();
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   },
// );

export default api;
