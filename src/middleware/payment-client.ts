import axios, { AxiosInstance } from 'axios';
import PaymentRequest from 'models/payment-request';
import PaymentResponse from 'models/payment-response';
import AuthenticationClient from './authentication-client';
import logger from 'middleware/logger';

export default class PaymentClient {
    private client: AxiosInstance;
    private authenticationClient: AuthenticationClient;

    constructor (authenticationClient: AuthenticationClient) {
      const client = logger.client('payment', axios.create({
        timeout: 3000,
        baseURL: 'https://pay-api.t7r.dev/v2/',
        headers: { 'content-type': 'application/json' }
      }));

      this.client = authenticationClient
        .attachAuthenticationRetry(client);

      this.authenticationClient = authenticationClient;
    }

    private getAuthorizationHeder = async () => {
      const token = await this.authenticationClient.authenticate();
      return {
        headers: {
          Authorization: token,
          'content-type': 'application/json'
        }
      };
    }

    initiatePayment = async (request: PaymentRequest) => {
      try {
        const headers = await this.getAuthorizationHeder();

        const { data } = await this.client.post<PaymentResponse>(
          'single-immediate-payment-initiation-requests',
          request,
          headers
        );

        return data;
      } catch (err) {
        return err.response.data;
      }
    }

    getPayment = async (payment_id: string) => {
      // TODO
    }
}
