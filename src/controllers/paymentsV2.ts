import { NextFunction, Request, Response } from 'express';
import { HttpException } from 'middleware/errors';

import AuthenticationClient from 'clients/authentication-client';
import PaymentsClient from 'clients/paymentv2-client';
import { intoSingleImmediatePaymentRequest, isPaymentRequest } from 'models/payment-request';

export default class PaymentsV2Controller {
  private paymentClient = new PaymentsClient(new AuthenticationClient());

  createPayment = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    try {
      if (!isPaymentRequest(body)) {
        throw new HttpException(400, 'Invalid request.');
      }

      const request = intoSingleImmediatePaymentRequest(body);
      const response = await this.paymentClient.initiatePayment(request);

      res.status(200).send(response);
    } catch (e) {
      next(e instanceof HttpException ? e : new HttpException(500, 'Failed to initiate payment.'));
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
