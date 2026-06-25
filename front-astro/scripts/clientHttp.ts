export type Config = {
  headers?: Record<string, string>;
};

export type ClientHttp = {
  get: <T>(url: string, config?: Config) => Promise<{ data: T }>;
  post: <C, R>(url: string, corps: C, config?: Config) => Promise<{ data: R }>;
  put: <C, R>(url: string, corps: C, config?: Config) => Promise<{ data: R }>;
};
