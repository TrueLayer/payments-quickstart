import axios, { AxiosInstance } from 'axios';
import AuthenticationClient from './authentication-client';
import logger from 'middleware/logger';
import { HttpException } from 'middleware/errors';
import RetryClientFactory from './retry-client-factory';
import config from 'config';
import { CreatePaymentRequest, CreatePaymentRequestResponse } from 'models/v3/payments-api/create_payment';
import { PaymentStatus } from 'models/v3/payments-api/payment_status';
import initRetryPolicy from './retry-policy';
import tlSigning from 'truelayer-signing';
import { v4 as uuid } from 'uuid';

/**
 * It interacts with the Payments V3 API.
 *
 * The main features exposed by this client are the creation of a payment and the retrieval of a payment status.
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

  /**
   * It creates a payment starting from a [CreatePaymentRequest](../models/v3/payments-api/create_payments.ts)
   *
   * - returns: A new payment.
   */
  initiatePayment = async (request: CreatePaymentRequest) => {
    const headers = await this.getHeaders();
    const idempotencyKey = uuid();
    const idempotencyHeader = { 'Idempotency-Key': idempotencyKey };

    const signature = tlSigning.sign({
      kid: config.KID,
      privateKeyPem: config.PRIVATE_KEY,
      method: 'POST',
      path: '/payments',
      headers: idempotencyHeader,
      body: JSON.stringify(request)
    });

    try {
      const { data } = await this.client.post<CreatePaymentRequestResponse>('/payments', request, {
        headers: {
          ...headers,
          'Tl-Signature': signature,
          ...idempotencyHeader
        }
      });
      return data;
    } catch (error: any) {
      console.error(error.response.data);
      throw HttpException.fromAxiosError(error, 'error_description');
    }
  };

  /**
   * It returns the status of a payment.
   *
   * - parameters:
   *   - paymentId: the identifier of a payment.
   *   - authorizationHeader: the authorization header that need to be sent to the Payments V3 Backend.
   * - returns: a payment status.
   */
  getStatus = async (paymentId: string) => {
    const headers = await this.getHeaders();

    try {
      const { data } = await this.client.get<PaymentStatus>(`/payments/${paymentId}`, { headers });
      return data;
    } catch (error: any) {
      console.log(error);
      throw HttpException.fromAxiosError(error, 'error_description');
    }
  };
}
