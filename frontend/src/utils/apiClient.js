import axios from 'axios'

const envBaseURL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');

// Resilient BaseURL resolution: 
// In dev, use the VITE_API_BASE_URL or fallback to localhost.
// In prod, use the /api proxy which is handled via vercel.json rewrites.
const resolvedBaseURL = import.meta.env.DEV
  ? (envBaseURL || 'http://localhost:5000/api')
  : '/api';

if (import.meta.env.DEV) {
  console.log('🚀 MentriQ API Base URL:', resolvedBaseURL);
}

const MAX_RETRIES = Number(
  import.meta.env.VITE_API_RETRY_COUNT ?? (import.meta.env.PROD ? 1 : 0)
);
const RETRY_DELAY_MS = Number(import.meta.env.VITE_API_RETRY_DELAY_MS || 600);

export const apiClient = axios.create({
  baseURL: resolvedBaseURL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const API_BASE_URL = resolvedBaseURL;

// Production Link Monitor & Error Diagnostics
if (!import.meta.env.DEV) {
  apiClient.interceptors.response.use(
    res => res,
    err => {
      const { config, response, message, code } = err;
      const logData = {
        url: config?.url,
        method: config?.method,
        status: response?.status,
        error: message,
        code: code,
        timestamp: new Date().toISOString(),
        resolvedBaseURL
      };

      // High-visibility production error log for debugging Vercel/Render proxying
      console.error('CRITICAL: [Infrastructure Connection Failure]', logData);

      return Promise.reject(err);
    }
  );
}

apiClient.interceptors.request.use(
  (config) => {
    const isAuthLoginOrRegister =
      typeof config.url === 'string' &&
      (config.url.startsWith('/auth/login') || config.url.startsWith('/auth/register'));
    const token = sessionStorage.getItem('token')
    if (token && !isAuthLoginOrRegister) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config || {};
    const method = (config.method || "get").toLowerCase();
    const status = error?.response?.status;
    const isNetworkError = !error?.response;
    const isTransientServerError = status >= 500;
    const isSafeMethod = ["get", "head", "options"].includes(method);
    const isAuthRoute = typeof config.url === "string" && config.url.startsWith("/auth/");

    config.__retryCount = config.__retryCount || 0;
    const shouldRetry =
      !isAuthRoute &&
      isSafeMethod &&
      config.__retryCount < MAX_RETRIES &&
      (isNetworkError || isTransientServerError);

    if (!shouldRetry) {
      return Promise.reject(error);
    }

    config.__retryCount += 1;
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * config.__retryCount));
    return apiClient(config);
  }
)
