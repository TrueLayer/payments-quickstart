import { AxiosError } from 'axios';
import { NextFunction, Request, Response } from 'express';

export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status || 500;
    this.message = message;
  }

  static fromAxiosError = (error: AxiosError, messageDataKey: string = '') =>
    error.code === 'ECONNABORTED' || error.message === 'Network Error'
      ? new HttpException(504, 'Server client request timed out.')
      : new HttpException(error.response?.status || 500, error.response?.data?.[messageDataKey] || error.message);
}

// Express requires all parameters in-order to recognize the function as a error middleware type.
// With out all 4 params express will treat as a standard middleware.
export default function error(error: HttpException, _req: Request, res: Response, _next: NextFunction) {
  if (process.env.NODE_ENV !== 'test') {
    console.error(error.status, error.message, error.stack);
  }

  return res.status(error.status).json({ error: error.message });
}
