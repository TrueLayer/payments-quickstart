import { NextFunction, Request, Response } from 'express';
import { HttpException } from 'middleware/errors';
import AuthenticationClient from 'clients/authentication-client';
import PaymentsClient from 'clients/payment-client';

export default class PaymentsController {
  private paymentClient = new PaymentsClient(new AuthenticationClient());

  createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.paymentClient.initiatePayment(req.body);
      res.status(200).send(response);
    } catch (e) {
      next(e instanceof HttpException ? e : new HttpException(500, 'Failed to initiate payments.'));
    }
  };

  getPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new HttpException(400, 'Expected `id` parameter.'));
    }

    try {
      const response = await this.paymentClient.getPayment(id);
      res.status(200).send(response);
    } catch (e) {
      next(e instanceof HttpException ? e : new HttpException(500, `Failed to retrieve payment: ${id}.`));
    }
  };
}
