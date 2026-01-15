export type ClientHttp = {
  get: <T>(
    url: string,
    config?: { headers?: Record<string, string> }
  ) => Promise<{ data: T }>;
};
