import axios, { AxiosInstance } from 'axios';
import AuthenticationClient from './authentication-client';
import logger from 'middleware/logger';
import { HttpException } from 'middleware/errors';
import RetryClientFactory from './retry-client-factory';
import config from 'config';
import { CreatePaymentRequest, CreatePaymentRequestReponse } from 'models/v3/payments-api/create_payment';
import { PaymentStatus } from 'models/v3/payments-api/payment_status';
import initRetryPolicy from './retry-policy';

/**
 * It interacts with the Payments V3 API.
 * 
 * The main features exposed by this client is the creation of a payment and the retrieval of a payment status.
 */
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

  private getResourceHeaders = (authorization: String) => ({
    'authorization': authorization,
    'content-type': 'application/json'
  });

  /**
   * It creates a payment starting from a [CreatePaymentRequest](../models/v3/payments-api/create_payments.ts)
   * 
   * - returns: A new payment.
   */ 
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

  /**
   * It returns the status of a payment
   * 
   * - parameters:
   *   - paymentId: the identifier of a payment
   *   - authorizationHeader: the authorization header that need to be sent to the Payments V3 Backend.
   * - returns: a payment status
   */
  getStatus = async (paymentId: string, authorizationHeader: string) => {
    const headers = this.getResourceHeaders(authorizationHeader)

    try {
      const { data } = await this.client.get<PaymentStatus>(`/payments/${paymentId}`, { headers });
      return data;
    } catch (error) {
      console.log(error);
      throw HttpException.fromAxiosError(error, 'error_description');
    }
  }
}
