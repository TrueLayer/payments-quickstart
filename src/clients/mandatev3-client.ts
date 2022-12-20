import axios, { AxiosError, AxiosInstance } from 'axios';
import AuthenticationClient from './authentication-client';
import logger from 'middleware/logger';
import { HttpException } from 'middleware/errors';
import RetryClientFactory from './retry-client-factory';
import config from 'config';
import initRetryPolicy from './retry-policy';
import { sign, HttpMethod } from 'truelayer-signing';
import { v4 as uuid } from 'uuid';
import { CreateMandateRequest, CreateMandateResponse } from 'models/v3/payments-api/create_mandates';
import { MandateResponse } from 'models/v3/payments-api/mandate_response';

/**
 * It interacts with the Payments V3 API.
 *
 * The main features exposed by this client are the creation of a payment and the retrieval of a payment status.
 */
export default class MandateClient {
  private client: AxiosInstance;
  private authenticationClient: AuthenticationClient;

  constructor(authenticationClient: AuthenticationClient) {
    const client = logger.client(
      'mandate',
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
    'authorization': await this.authenticationClient.authenticate('recurring_payments:sweeping'),
    'content-type': 'application/json'
  });

  /**
   * It creates a mandate starting from a [CreateMandateRequest](../models/v3/payments-api/create_mandates.ts)
   *
   * - returns: A new mandate.
   */
  initiateMandate = async (request: CreateMandateRequest) => {
    const headers = await this.getHeaders();
    const idempotencyKey = uuid();
    const idempotencyHeader = { 'Idempotency-Key': idempotencyKey };

    const signature = sign({
      kid: config.KID,
      privateKeyPem: config.PRIVATE_KEY,
      method: HttpMethod.Post,
      path: '/mandates',
      headers: idempotencyHeader,
      body: JSON.stringify(request)
    });

    try {
      const response = await this.client.post<CreateMandateResponse>('/mandates', request, {
        headers: {
          ...headers,
          'Tl-Signature': signature,
          ...idempotencyHeader
        }
      });

      return response.data;
    } catch (error: unknown) {
      console.error(error);

      throw HttpException.fromAxiosError(error as AxiosError, 'error_description');
    }
  };

  /**
   * It returns the status of a mandate.
   *
   * - parameters:
   *   - mandateId: the identifier of a mandate.
   *   - authorizationHeader: the authorization header that need to be sent to the Payments V3 Backend.
   * - returns: a payment status.
   */
  getMandate = async (mandateId: string) => {
    const headers = await this.getHeaders();

    try {
      const { data } = await this.client.get<MandateResponse>(`/mandates/${mandateId}`, { headers });
      return data;
    } catch (error: any) {
      console.log(error.data);

      throw HttpException.fromAxiosError(error, 'error_description');
    }
  };
}
