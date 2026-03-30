export type Config = {
  headers?: Record<string, string>;
};

export type ClientHttp = {
  get: <T>(url: string, config?: Config) => Promise<{ data: T }>;
};

export type ClientHttpPosteur<C, R> = {
  post: (url: string, corps: C, config?: { headers?: Record<string, string> }) => Promise<{ data: R }>;
};
