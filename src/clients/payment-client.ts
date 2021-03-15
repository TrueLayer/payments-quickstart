import axios, { AxiosInstance } from 'axios';
import AuthenticationClient from './authentication-client';
import logger from 'middleware/logger';
import { HttpException } from 'middleware/errors';
import RetryClientFactory from './retry-client-factory';
import config from 'config';
import { SingleImmediateProviderResponse, SingleImmediatePaymentResponse } from 'models/payments-api/responses';
import { SingleImmediateProviderRequest, SingleImmediatePaymentRequest } from 'models/payments-api/requests';
import { intoUrlParams } from 'utils';
import initRetryPolicy from './retry-policy';

export default class PaymentClient {
  private client: AxiosInstance;
  private authenticationClient: AuthenticationClient;

  constructor(authenticationClient: AuthenticationClient) {
    const client = logger.client(
      'payment',
      axios.create({
        timeout: config.HTTP_CLIENT_TIMEOUT,
        baseURL: config.PAYMENTS_URI,
        headers: { 'content-type': 'application/json' }
      })
    );

    this.client = new RetryClientFactory(initRetryPolicy(authenticationClient)).attach(client);
    this.authenticationClient = authenticationClient;
  }

  private getHeaders = async () => ({
    'authorization': await this.authenticationClient.authenticate(),
    'content-type': 'application/json'
  });

  initiatePayment = async (request: SingleImmediatePaymentRequest) => {
    const headers = await this.getHeaders();

    try {
      const { data } = await this.client.post<SingleImmediatePaymentResponse>(
        '/single-immediate-payment-initiation-requests',
        request,
        { headers }
      );
      return data;
    } catch (error) {
      throw HttpException.fromAxiosError(error, 'error_description');
    }
  };

  getPayment = async (paymentId: string) => {
    const headers = await this.getHeaders();

    try {
      const { data } = await this.client.get<SingleImmediatePaymentResponse>(
        `/single-immediate-payments/${paymentId}`,
        { headers }
      );
      return data;
    } catch (error) {
      throw HttpException.fromAxiosError(error, 'error_description');
    }
  };

  getProviders = async (param: SingleImmediateProviderRequest) => {
    try {
      const { data } = await this.client.get<SingleImmediateProviderResponse>(
        `/single-immediate-payments-providers?${intoUrlParams(param)}`
      );
      return data;
    } catch (error) {
      throw HttpException.fromAxiosError(error, 'error_description');
    }
  };
}
