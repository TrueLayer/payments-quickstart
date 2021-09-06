import axios, { AxiosInstance } from 'axios';
import AuthenticationClient from './authentication-client';
import logger from 'middleware/logger';
import { HttpException } from 'middleware/errors';
import RetryClientFactory from './retry-client-factory';
import config from 'config';
import { CreatePaymentRequest, CreatePaymentRequestReponse } from 'models/v3/payments-api/create_payment';
import initRetryPolicy from './retry-policy';

export default class PaymentClient {
  private client: AxiosInstance;
  private authenticationClient: AuthenticationClient;

  constructor(authenticationClient: AuthenticationClient) {
    const client = logger.client(
      'payment',
      axios.create({
        timeout: config.HTTP_CLIENT_TIMEOUT,
        baseURL: config.PAYMENTS_V3_URI,
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

  initiatePayment = async (request: CreatePaymentRequest) => {
    const headers = await this.getHeaders();

    try {
      const { data } = await this.client.post<CreatePaymentRequestReponse>('/payments', request, { headers });
      return data;
    } catch (error) {
      console.log(error);
      throw HttpException.fromAxiosError(error, 'error_description');
    }
  };
}
