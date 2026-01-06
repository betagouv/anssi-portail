export type ClientHttp<T> = {
  get: (
    url: string,
    config?: { headers?: Record<string, string> }
  ) => Promise<{ data: T }>;
};

export type ClientHttpPosteur<C, R> = {
  post: (
    url: string,
    corps: C,
    config?: { headers?: Record<string, string> }
  ) => Promise<{ data: R }>;
};
