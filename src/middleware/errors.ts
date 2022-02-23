import { AxiosError } from 'axios';
import { NextFunction, Request, Response } from 'express';

export class HttpException extends Error {
  public status: number;
  public message: string;
  public details: any;

  constructor(status: number, message: string, details: any = null) {
    super(message);
    this.status = status || 500;
    this.message = message;
    this.details = details;
  }

  static fromAxiosError = (error: AxiosError, messageDataKey: string = '') =>
    error.code === 'ECONNABORTED' || error.message === 'Network Error'
      ? new HttpException(504, 'Server client request timed out.')
      : new HttpException(
          error.response?.status || 500,
          error.response?.data?.[messageDataKey] || error.message,
          error.response?.data?.error_details
        );

  log = () => {
    console.error('HttpError: ', {
      status: this.status,
      message: this.message,
      details: this.details
    });

    console.error(this.stack);
  };
}

// Express requires all parameters in-order to recognize the function as a error middleware type.
// With out all 4 params express will treat as a standard middleware.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function error(error: HttpException, _req: Request, res: Response, _next: NextFunction) {
  if (process.env.NODE_ENV !== 'test') {
    error.log();
  }

  return res.status(error.status).json({
    error: error.message,
    details: error.details
  });
}
