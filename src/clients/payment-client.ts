import axios, { AxiosInstance } from 'axios';
import { buildPaymentApiRequest, PaymentRequest } from 'models/payments/request';
import PaymentResponse from 'models/payments/response';
import AuthenticationClient from './authentication-client';
import logger from 'middleware/logger';
import { HttpException } from 'middleware/errors';
import RetryClient from './retry-client';
import config from 'config';

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

    try {
      const headers = await this.getHeaders();
      const { data } = await this.client.post<PaymentResponse>('/single-immediate-payment-initiation-requests', apiRequest, { headers });
      return data;
    } catch (error) {
      throw HttpException.fromAxiosError(error);
    }
  };

  getPayment = async (paymentId: string) => {
    try {
      const headers = await this.getHeaders();
      const { data } = await this.client.get<PaymentResponse>(`/single-immediate-payments/${paymentId}`, { headers });
      return data;
    } catch (error) {
      throw HttpException.fromAxiosError(error);
    }
  };
}
