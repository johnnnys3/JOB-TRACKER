const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

if (process.env.NODE_ENV === 'production' && !configuredApiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL must be set for production builds');
}

const API_BASE_URL = configuredApiUrl || 'http://localhost:3002';

type RequestInterceptor = (endpoint: string, options: RequestInit) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

export const apiInterceptors = {
  addRequest(interceptor: RequestInterceptor) {
    requestInterceptors.push(interceptor);
    return () => {
      const index = requestInterceptors.indexOf(interceptor);
      if (index >= 0) requestInterceptors.splice(index, 1);
    };
  },
  addResponse(interceptor: ResponseInterceptor) {
    responseInterceptors.push(interceptor);
    return () => {
      const index = responseInterceptors.indexOf(interceptor);
      if (index >= 0) responseInterceptors.splice(index, 1);
    };
  },
};

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public error?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryAuth = true
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  let config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
    credentials: 'include', // For httpOnly cookies
    ...options,
  };

  for (const interceptor of requestInterceptors) {
    config = await interceptor(endpoint, config);
  }

  let response = await fetch(url, config);

  for (const interceptor of responseInterceptors) {
    response = await interceptor(response);
  }

  if (response.status === 401 && retryAuth && endpoint !== '/auth/refresh') {
    const refreshed = await refreshSession();
    if (refreshed) {
      return apiRequest<T>(endpoint, options, false);
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || 'Request failed',
      errorData.error
    );
  }

  return response.json() as Promise<T>;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = apiRequest('/auth/refresh', { method: 'POST' }, false)
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  post: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};
