import {
  allStatusCode,
  ErrorApiResponse,
  errorStatusCode,
  SuccessApiResponse,
  successStatusCode,
} from '../types/apt';

export function CustomResponse<T>(
  success: boolean,
  statusCode: (typeof allStatusCode)[number],
  message: string,
  data?: T,
  error?: T,
) {
  if (success) {
    const res: SuccessApiResponse<T> = {
      message: message,
      statusCode: statusCode as (typeof successStatusCode)[number],
    };
    if (data !== undefined && data !== null) {
      res['data'] = data;
    }

    return res;
  } else {
    const res: ErrorApiResponse<T> = {
      message: message,
      statusCode: statusCode as (typeof errorStatusCode)[number],
      data: null,
    };
    if (error !== undefined && error !== null) {
      if (typeof error === 'object' && Object.keys(error).length === 0) {
        return res;
      }
      res['error'] = error;
    }

    return res;
  }
}

export function CustomSuccessResponse<T>(
  statusCode: (typeof successStatusCode)[number],
  message: string,
  data?: T,
) {
  const res: SuccessApiResponse<T> = {
    message: message,
    statusCode: statusCode,
  };
  if (data !== undefined && data !== null) {
    res['data'] = data as T;
  }
  return res;
}

export function SuccessResponse<T>(
  msg: string,
  data?: T,
  statusCode: (typeof successStatusCode)[number] = 200,
) {
  return CustomSuccessResponse<T>(statusCode, msg, data);
}

export function CustomErrorResponse<T>(
  statusCode: (typeof errorStatusCode)[number],
  message: string,
  error?: T,
) {
  const res: ErrorApiResponse<T> = {
    message: message,
    statusCode: statusCode,
    data: null,
  };
  if (error !== undefined && error !== null) {
    if (Object.keys(error).length === 0) {
      return res;
    }
    res['error'] = error;
  }

  return res;
}
export function ErrorResponse<T>(
  msg: string,
  err?: T,
  statusCode: (typeof errorStatusCode)[number] = 400,
) {
  const message = err instanceof Error ? err.message : msg;

  return CustomErrorResponse<T>(statusCode, message, err);
}
