import { NextFunction, Request, Response } from 'express';

export default class PaymentsV3Controller {
  createPayment = async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(501).send();
  };

  getPayment = async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(501).send();
  };
}
