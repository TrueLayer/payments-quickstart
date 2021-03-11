import axios, { AxiosInstance } from 'axios';
import { buildPaymentApiRequest, PaymentRequest } from 'models/payments/request';
import PaymentResponse from 'models/payments/response';
import AuthenticationClient from './authentication-client';
import logger from 'middleware/logger';
import { HttpException } from 'middleware/errors';
import RetryClient from './retry-client';
import config from 'config';
import { ProvidersResponse } from 'models/providers/payments-api-response';
import { ProviderQuery } from 'models/providers/provider-query';
import qs from 'qs';

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
      errorCondition: error => error.response?.status === 401,
      onRetry: async request => {
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

  initiatePayment = async (request: PaymentRequest) => {
    const apiRequest = buildPaymentApiRequest(request);
    const headers = await this.getHeaders();

    try {
      const { data } = await this.client.post<PaymentResponse>('/single-immediate-payment-initiation-requests', apiRequest, { headers });
      return data;
    } catch (error) {
      throw HttpException.fromAxiosError(error, 'error_description');
    }
  };

  getPayment = async (paymentId: string) => {
    const headers = await this.getHeaders();

    try {
      const { data } = await this.client.get<PaymentResponse>(`/single-immediate-payments/${paymentId}`, { headers });
      return data;
    } catch (error) {
      throw HttpException.fromAxiosError(error, 'error_description');
    }
  };

  getProviders = async (param: ProviderQuery) => {
    const query = qs.stringify(param, { arrayFormat: 'comma' });
    try {
      const { data } = await this.client.get<ProvidersResponse>(`/single-immediate-payments-providers?${query}`);
      return data;
    } catch (error) {
      throw HttpException.fromAxiosError(error, 'error_description');
    }
  };
}
