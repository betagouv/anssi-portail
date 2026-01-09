export type ClientHttp<T> = {
  get: (
    url: string,
    config?: { headers?: Record<string, string> }
  ) => Promise<{ data: T }>;
};
