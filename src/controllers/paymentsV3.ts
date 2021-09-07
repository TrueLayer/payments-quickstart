import { NextFunction, Request, Response } from 'express';

import { v4 as uuid } from 'uuid';
import AuthenticationClient from 'clients/authentication-client';
import PaymentsClient from 'clients/paymentv3-client';
import { HttpException } from 'middleware/errors';
import config from 'config';
import { CreatePaymentRequest } from 'models/v3/payments-api/create_payment';

export default class PaymentsV3Controller {
  private paymentClient = new PaymentsClient(new AuthenticationClient());

  createPayment = async (_req: Request, res: Response, next: NextFunction) => {
    const request = this.buildPaymentRequest();

    try {
      // Ideally we should use DTOs / Domain Types but givent that the API spec is still work in progress, we keep the type transparent
      const response = await this.paymentClient.initiatePayment(request);
      res.status(200).send(response);
    } catch (e) {
      next(e instanceof HttpException ? e : new HttpException(500, 'Failed to initiate payment.'));
    }
  };

  getPayment = async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(501).send();
  };

  private buildPaymentRequest(): CreatePaymentRequest {
    return {
      id: uuid(),
      amount_in_minor: 1,
      currency: 'GBP',
      payment_method: {
        statement_reference: 'some ref',
        type: 'bank_transfer'
      },
      beneficiary: {
        type: 'external',
        name: 'John Doe',
        reference: 'Test Ref',
        scheme_identifier: {
          type: 'sort_code_account_number',
          account_number: config.ACCOUNT_NUMBER,
          sort_code: config.SORT_CODE
        }
      }
    };
  }
}
