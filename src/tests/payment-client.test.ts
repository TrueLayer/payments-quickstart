/* eslint-disable camelcase */

import nock, { Interceptor } from 'nock';
import PaymentsClient from '../middleware/payment-client';
import AuthenticationClient from '../middleware/authentication-client';
import { mockPaymentResponse } from './mock-payment-response';
import { fakePaymentApiRequest } from './mock-payment-request';

let paymentsClient: PaymentsClient;
let authServer: Interceptor;

beforeEach(() => {
  const authenticationClient = new AuthenticationClient();
  paymentsClient = new PaymentsClient(authenticationClient);
  authServer = nock('https://auth.t7r.dev', {
    reqheaders: { 'content-type': 'application/json' }
  })
    .post('/connect/token');
});

function mockServerEndpoints (authTimes: number) {
  const access_token = 'access_token';

  const auth = authServer
    .times(authTimes)
    .reply(200, { access_token, expires_in: 3600, token_type: 'bearer' });

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
      const { auth, payments } = mockServerEndpoints(1);

      payments.get('/single-immediate-payments/1');
      await paymentsClient.getPayment('1');

      auth.done();
      payments.done();
    });

    it('401 from payments-api clears cached `access_token`.', async () => {
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

      const response = await paymentsClient.getPayment('1');
      expect(response).toEqual(mockResponse);

      auth.done();
      payments.done();
    });

    it('3 x 401 from payments-api results in an error.', async () => {
      const { auth, payments } = mockServerEndpoints(3);

      payments
        .get('/single-immediate-payments/1')
        .times(3)
        .reply(401);

      const response = await paymentsClient.getPayment('1');
      expect(response).toEqual({
        error: 'Request failed with status code 401'
      });

      auth.done();
      payments.done();
    });
  });

  describe('`initiatePayment`', () => {
    it('`access_token` is attached to payments api request.', async () => {
      const { auth, payments } = mockServerEndpoints(1);

      payments
        .post('/single-immediate-payment-initiation-requests')
        .times(1)
        .reply(200, mockPaymentResponse());

      await paymentsClient.initiatePayment(fakePaymentApiRequest());

      auth.done();
      payments.done();
    });

    it('401 from payments-api clears cached `access_token`.', async () => {
      const { auth, payments } = mockServerEndpoints(2);
      const mockResponse = mockPaymentResponse();
      payments
        .post('/single-immediate-payment-initiation-requests')
        .times(1)
        .reply(401) // Trigger a retry.
        .post('/single-immediate-payment-initiation-requests')
        .times(1)
        .reply(200, mockResponse);

      const response = await paymentsClient.initiatePayment(fakePaymentApiRequest());
      expect(response).toEqual(mockResponse);

      auth.done();
      payments.done();
    });

    it('3 x 401 from payments-api results in an error.', async () => {
      const { auth, payments } = mockServerEndpoints(3);

      payments
        .post('/single-immediate-payment-initiation-requests')
        .times(3)
        .reply(401);

      const response = await paymentsClient.initiatePayment(fakePaymentApiRequest());
      expect(response).toEqual({
        error: 'Request failed with status code 401'
      });

      auth.done();
      payments.done();
    });
  });
});
