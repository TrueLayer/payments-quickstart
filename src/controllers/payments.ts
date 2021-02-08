import { NextFunction, Request, Response } from 'express';
import PaymentClient from 'middleware/payment-client';
import { HttpException } from 'middleware/errors';

export default class PaymentsController {
    private paymentClient: PaymentClient;

    constructor (
      paymentClient: PaymentClient
    ) {
      this.paymentClient = paymentClient;
    }

    createPayment = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await this.paymentClient.initiatePayment(req.body);
        res.status(200).send(response);
      } catch (e) {
        next(new HttpException(500, 'Failed to initiate payments.'));
      }
    }

    getPayment = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const response = await this.paymentClient.getPayment(id);
        res.status(200).send(response);
      } catch (e) {
        next(new HttpException(500, 'Failed to retrieve payment.'));
      }
    }
}
