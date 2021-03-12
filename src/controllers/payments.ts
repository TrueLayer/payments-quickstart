import { NextFunction, Request, Response } from 'express';
import { HttpException } from 'middleware/errors';
import { PaymentRequest } from 'models/payments/request';
import AuthenticationClient from 'clients/authentication-client';
import PaymentsClient from 'clients/payment-client';
import { Provider, ProvidersResponse } from 'models/providers/response';
import config from 'config';
import { ProviderQuery } from 'models/providers/provider-query';
import { ReleaseChannel, SupportedCurrency } from 'models/payments/response';

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

  getProviders = async (req: Request, res: Response, next: NextFunction) => {
    const currency = (req.query.currency as SupportedCurrency[]) || ['GBP'];
    const releaseChannel = (req.query.release_channel as ReleaseChannel[]) || ['live'];

    const query: ProviderQuery = {
      auth_flow_type: 'redirect',
      account_type: 'sort_code_account_number',
      currency: currency,
      release_channel: releaseChannel,
      client_id: config.CLIENT_ID
    };

    try {
      const apiResponse = await this.paymentClient.getProviders(query);

      const providers: Provider[] = apiResponse.results.map(provider => ({
        provider_id: provider.provider_id,
        display_name: provider.display_name,
        country: provider.country,
        logo_url: provider.logo_url,
        release_stage: provider.release_stage,
        icon_url: provider.logo_url,
        enabled: true
      }));

      const response: ProvidersResponse = {
        results: providers
      };

      res.status(200).send(response);
    } catch (e) {
      console.log(e);
      next(e instanceof HttpException ? e : new HttpException(500, `Failed to retrieve providers: ${query}.`));
    }
  };
}
