import axios, { AxiosInstance } from 'axios';
import PaymentRequest from 'models/payments/request';
import PaymentResponse from 'models/payments/response';
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

    private getAuthorizationHeder = async () => ({
      'authorization': await this.authenticationClient.authenticate(),
      'content-type': 'application/json'
    })

    initiatePayment = async (request: PaymentRequest) => {
      const headers = await this.getAuthorizationHeder();
      try {
        const { data } = await this.client.post<PaymentResponse>(
          'single-immediate-payment-initiation-requests',
          request,
          { headers }
        );

        return data;
      } catch (error) {
        return error.response?.data || { error: error.message };
      }
    }

    getPayment = async (paymentId: string) => {
      const headers = await this.getAuthorizationHeder();
      try {
        const { data } = await this.client.get<PaymentResponse>(
          `single-immediate-payments/${paymentId}`,
          { headers }
        );
        return data;
      } catch (error) {
        return error.response?.data || { error: error.message };
      }
    }
}
