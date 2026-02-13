export type ClientHttp = {
  get: <T>(
    url: string,
    config?: { headers?: Record<string, string> }
  ) => Promise<{ data: T }>;
};

export type ClientHttpPosteur = {
  post: <C, R>(
    url: string,
    corps: C,
    config?: { headers?: Record<string, string> }
  ) => Promise<{ data: R }>;
};
