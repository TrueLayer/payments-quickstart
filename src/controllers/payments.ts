import { NextFunction, Request, Response } from 'express';
import { authenticate, initiatePayment } from 'middleware/client';
import { HttpException } from 'middleware/errors';

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = await authenticate();
    const response = await initiatePayment(req.body, accessToken);
    res.status(200).send(response);
  } catch (e) {
    next(new HttpException(500, 'Failed to initiate payments.'));
  }
};
