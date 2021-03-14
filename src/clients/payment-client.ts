import axios, { AxiosInstance } from 'axios';
import AuthenticationClient from './authentication-client';
import logger from 'middleware/logger';
import { HttpException } from 'middleware/errors';
import RetryClient from './retry-client';
import config from 'config';
import { SingleImmediateProviderResponse, SingleImmediatePaymentResponse } from 'models/payments-api/responses';
import { SingleImmediateProviderRequest, SingleImmediatePaymentRequest } from 'models/payments-api/requests';
import { intoUrlParams } from 'utils';

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

    // attach a retry policy for any UNAUTHORIZED responses from payments-client.
    this.client = new RetryClient({
      retries: 3,
      isRetryableError: error => error.response?.status === 401,
      retry: async request => {
        authenticationClient.invalidateCache();
        request.headers.authorization = await this.authenticationClient.authenticate();
        return request;
      }
    }).attach(client);

    this.authenticationClient = authenticationClient;
  }

  private getHeaders = async () => ({
    'authorization': await this.authenticationClient.authenticate(),
    'content-type': 'application/json'
  });

  initiatePayment = async (request: SingleImmediatePaymentRequest) => {
    const headers = await this.getHeaders();

    try {
      const { data } = await this.client.post<SingleImmediatePaymentResponse>('/single-immediate-payment-initiation-requests', request, {
        headers
      });
      return data;
    } catch (error) {
      throw HttpException.fromAxiosError(error, 'error_description');
    }
  };

  getPayment = async (paymentId: string) => {
    const headers = await this.getHeaders();

    try {
      const { data } = await this.client.get<SingleImmediatePaymentResponse>(`/single-immediate-payments/${paymentId}`, { headers });
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
