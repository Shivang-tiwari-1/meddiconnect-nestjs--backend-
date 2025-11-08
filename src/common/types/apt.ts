export const allStatusCode = [200, 201, 204, 400, 400, 502] as const;
export const successStatusCode = [200, 201, 204] as const;
export const errorStatusCode = [400, 400, 502] as const;

export type BaseApiResponse = {
  message: string;
  statusCode: (typeof allStatusCode)[number];
};

export type SuccessApiResponse<T = unknown> = BaseApiResponse & {
  statusCode: (typeof successStatusCode)[number];
  data?: T;
};

export type ErrorApiResponse<T = unknown> = BaseApiResponse & {
  statusCode: (typeof errorStatusCode)[number];
  error?: T;
  data: null;
};

export type FinalResponse<T1 = unknown, T2 = unknown> =
  | (T1 extends { data: infer D }
      ? Promise<SuccessApiResponse<D>>
      : Promise<SuccessApiResponse>)
  | (T2 extends { error: infer E } ? ErrorApiResponse<E> : ErrorApiResponse);
