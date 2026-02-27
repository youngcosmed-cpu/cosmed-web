import axios from 'axios';

// Access Token — module-scope variable (not in localStorage for XSS defense)
let accessToken: string | null = null;
export function getAccessToken() { return accessToken; }
export function setAccessToken(token: string | null) { accessToken = token; }

export const api = axios.create({
  baseURL: '/api',
});

// Separate instance without interceptors (prevents recursive refresh loops)
const rawApi = axios.create({
  baseURL: '/api',
});

// Request interceptor: inject Access Token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// [H1] Refresh queue pattern to prevent race conditions
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

export function resetRefreshState() {
  isRefreshing = false;
  failedQueue = [];
}

// Response interceptor: refresh on 401 and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest.url?.startsWith('/auth/');
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Another refresh is in progress — queue this request
        originalRequest._retry = true;
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await rawApi.post('/auth/refresh');
        setAccessToken(data.accessToken);
        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        setAccessToken(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
