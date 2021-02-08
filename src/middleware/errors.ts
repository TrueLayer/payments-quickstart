import { Request, Response } from 'express';

export class HttpException extends Error {
    public status: number;
    public message: string;

    constructor (status: number, message: string) {
      super(message);
      this.status = status;
      this.message = message;
    }
}

export default function error (error: HttpException, _: Request, res: Response) {
  res.status(error.status);
  res.json({ error: error.message }).send();
}
