import { NextFunction, Request, Response } from 'express';
import { HttpException } from 'middleware/errors';
import { PaymentRequest } from 'models/payments/request';
import AuthenticationClient from 'clients/authentication-client';
import PaymentsClient from 'clients/payment-client';

export default class PaymentsController {
  private paymentClient = new PaymentsClient(new AuthenticationClient());

  private parseBodyToPaymentRequest(body: any): PaymentRequest {
    if (!body.provider_id) {
      throw new HttpException(400, '`provider_id` is required.');
    }
    return body;
  }

  createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = this.parseBodyToPaymentRequest(req.body);
      const response = await this.paymentClient.initiatePayment(request);
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
