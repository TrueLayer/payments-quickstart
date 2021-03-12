import { NextFunction, Request, Response } from 'express';
import { HttpException } from 'middleware/errors';

import config from 'config';
import { include } from 'utils';
import AuthenticationClient from 'clients/authentication-client';
import PaymentsClient from 'clients/payment-client';
import { ReleaseChannel, SupportedCurrency } from 'models/payments-api/common';
import { intoSingleImmediatePaymentRequest, isPaymentRequest, PaymentRequest } from 'models/payments/request';
import { Provider } from 'models/payments/response';

export default class PaymentsController {
  private paymentClient = new PaymentsClient(new AuthenticationClient());

  private parseBodyToPaymentRequest = (body: any): PaymentRequest => {
    if (isPaymentRequest(body)) {
      return body;
    } else {
      throw new HttpException(400, 'Invalid request.');
    }
  };

  createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = intoSingleImmediatePaymentRequest(this.parseBodyToPaymentRequest(req.body));
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

  getProviders = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const currency = (query.currency || ['GBP']) as SupportedCurrency[];
    const channel = (query.release_channel || ['live']) as ReleaseChannel[];

    try {
      const apiResponse = await this.paymentClient.getProviders({
        account_type: 'sort_code_account_number',
        auth_flow_type: 'redirect',
        release_channel: channel,
        client_id: config.CLIENT_ID,
        currency
      });

      const results = apiResponse.results.map<Provider>(provider => ({
        ...include(provider, ['provider_id', 'display_name', 'country', 'logo_url', 'icon_url', 'release_stage']),
        enabled: true
      }));

      res.status(200).send({ results });
    } catch (e) {
      next(e instanceof HttpException ? e : new HttpException(500, `Failed to retrieve providers: ${query}.`));
    }
  };
}
