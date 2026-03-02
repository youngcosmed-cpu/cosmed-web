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
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
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

// Shared refresh function — ensures only one refresh request is in-flight at a time.
// Used by both the response interceptor and AuthProvider.initAuth.
export function performRefresh(): Promise<string> {
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  return rawApi
    .post('/auth/refresh')
    .then(({ data }) => {
      setAccessToken(data.accessToken);
      processQueue(null, data.accessToken);
      return data.accessToken as string;
    })
    .catch((error) => {
      processQueue(error);
      setAccessToken(null);
      throw error;
    })
    .finally(() => {
      isRefreshing = false;
    });
}

// Response interceptor: refresh on 401 and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest.url?.startsWith('/auth/');
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const token = await performRefresh();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch {
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
