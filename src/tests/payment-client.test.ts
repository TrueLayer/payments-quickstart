/* eslint-disable camelcase */

import nock, { Interceptor } from 'nock';
import PaymentsClient from 'clients/payment-client';
import AuthenticationClient from 'clients/authentication-client';
import { mockPaymentResponse } from './mock-payment-response';
import { fakePaymentRequest } from './mock-payment-request';
import { HttpException } from 'middleware/errors';

let paymentsClient: PaymentsClient;
let authServer: Interceptor;

beforeEach(() => {
  paymentsClient = new PaymentsClient(new AuthenticationClient());
  authServer = nock('https://auth.t7r.dev', {
    reqheaders: { 'content-type': 'application/json' }
  }).post('/connect/token');
});

function mockServerEndpoints(authTimes: number) {
  const access_token = 'access_token';

  const auth = authServer.times(authTimes).reply(200, {
    access_token,
    expires_in: 3600,
    token_type: 'bearer'
  });

  const payments = nock('https://pay-api.t7r.dev/v2', {
    reqheaders: {
      'authorization': `Bearer ${access_token}`,
      'content-type': 'application/json'
    }
  });

  return { auth, payments };
}

describe('`payments-client`', () => {
  describe('`getPayment`', () => {
    it('`access_token` is attached to payments api request.', async () => {
      // Arrange
      const { auth, payments } = mockServerEndpoints(1);
      payments.get('/single-immediate-payments/1').times(1).reply(200, mockPaymentResponse());

      // Act
      await paymentsClient.getPayment('1');

      // Assert
      auth.done();
      payments.done();
    });

    it('401 from payments-api clears cached `access_token`.', async () => {
      // Arrange
      // An additional auth request should be made as Cache is cleared.
      const { auth, payments } = mockServerEndpoints(2);
      const mockResponse = mockPaymentResponse();

      payments
        .get('/single-immediate-payments/1')
        .times(1)
        .reply(401) // Trigger a retry.
        .get('/single-immediate-payments/1')
        .times(1)
        .reply(200, mockResponse);

      // Act
      const response = await paymentsClient.getPayment('1');

      // Assert
      expect(response).toEqual(mockResponse);

      auth.done();
      payments.done();
    });

    it('3 x 401 from payments-api results in an error.', async () => {
      // Arrange
      const { auth, payments } = mockServerEndpoints(3);
      payments.get('/single-immediate-payments/1').times(3).reply(401);

      // Act & Assert
      await expect(paymentsClient.getPayment('1')).rejects.toThrow('Request failed with status code 401');

      auth.done();
      payments.done();
    });
  });

  describe('`initiatePayment`', () => {
    it('`access_token` is attached to payments api request.', async () => {
      // Arrange
      const { auth, payments } = mockServerEndpoints(1);
      payments.post('/single-immediate-payment-initiation-requests').times(1).reply(200, mockPaymentResponse());

      // Act
      await paymentsClient.initiatePayment(fakePaymentRequest());

      // Assert
      auth.done();
      payments.done();
    });

    it('401 from payments-api clears cached `access_token`.', async () => {
      // Arrange
      const { auth, payments } = mockServerEndpoints(2);
      const mockResponse = mockPaymentResponse();
      payments
        .post('/single-immediate-payment-initiation-requests')
        .times(1)
        .reply(401) // Trigger a retry.
        .post('/single-immediate-payment-initiation-requests')
        .times(1)
        .reply(200, mockResponse);

      // Act
      const response = await paymentsClient.initiatePayment(fakePaymentRequest());

      // Assert
      expect(response).toEqual(mockResponse);

      auth.done();
      payments.done();
    });

    it('3 x 401 from payments-api results in an error.', async () => {
      // Arrange
      const { auth, payments } = mockServerEndpoints(3);
      payments.post('/single-immediate-payment-initiation-requests').times(3).reply(401);

      // Act & Assert
      await expect(paymentsClient.initiatePayment(fakePaymentRequest())).rejects.toThrowError(
        new HttpException(401, 'Request failed with status code 401')
      );

      auth.done();
      payments.done();
    });
  });
});
