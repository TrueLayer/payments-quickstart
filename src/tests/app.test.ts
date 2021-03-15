import app from 'app';
import nock, { Scope } from 'nock';
import supertest, { SuperTest } from 'supertest';
import { mockPaymentResponse } from './mock-payment-response';
import fakePaymentApiRequest, { fakePaymentRequest } from './mock-payment-request';
import { intoSingleImmediatePaymentRequest } from 'models/payments/request';
import config from 'config';
import { intoUrlParams } from 'utils';
import mockProvidersResponse from './mock-providers-response';
import expectedProvidersResponse from './expected-providers-response';
import fillerSandboxProviders from 'models/payments/sandbox-providers-response';

let request: SuperTest<any>;

beforeEach(() => {
  request = supertest(app);

  nock(config.AUTH_URI, {
    reqheaders: { 'content-type': 'application/json' }
  })
    .post('/connect/token')
    .reply(200, { access_token: 'access_token', expires_in: 3600, token_type: 'bearer' });
});

describe('api', () => {
  describe('GET `/payments:id`', () => {
    beforeEach(() => {
      nock(config.PAYMENTS_URI, {
        reqheaders: {
          'authorization': 'Bearer access_token',
          'content-type': 'application/json'
        }
      })
        .get('/single-immediate-payments/1')
        .reply(200, mockPaymentResponse());
    });

    it('works', done => {
      request.get('/payment/1').expect(200, mockPaymentResponse(), done);
    });

    it('404 occurs without `:id` paramter', done => {
      request.get('/payment').expect(404, done);
    });
  });
  describe('POST `/payments`', () => {
    let paymentsApi: Scope;

    beforeEach(() => {
      paymentsApi = nock(config.PAYMENTS_URI, {
        reqheaders: {
          'authorization': 'Bearer access_token',
          'content-type': 'application/json'
        }
      });
    });

    it('works', done => {
      // Arrange
      const expectedBody = JSON.stringify(fakePaymentApiRequest());
      paymentsApi
        .post('/single-immediate-payment-initiation-requests', expectedBody)
        .times(1)
        .reply(200, mockPaymentResponse());

      // Act & Assert
      request.post('/payment').send(fakePaymentRequest()).expect(200, mockPaymentResponse(), done);
    });

    it('Only requires `provider_id` as a paramter', async done => {
      const paymentRequest = { provider_id: 'provider_id' };
      const expectedBody = intoSingleImmediatePaymentRequest(paymentRequest);

      paymentsApi
        .post('/single-immediate-payment-initiation-requests', body => {
          // Uuid is created on the fly.
          expectedBody.single_immediate_payment.single_immediate_payment_id =
            body.single_immediate_payment.single_immediate_payment_id;
          expect(body).toEqual(expectedBody);
          return true;
        })
        .times(1)
        .reply(200, mockPaymentResponse());

      request
        .post('/payment')
        .send({ provider_id: expectedBody.single_immediate_payment.provider_id })
        .expect(200, mockPaymentResponse(), done);
    });

    it('invalid parameters returns a 400', async done => {
      request.post('/payment').send({}).expect(400, done);
    });
  });

  describe('GET `/providers`', () => {
    let paymentsApi: Scope;
    beforeEach(() => {
      paymentsApi = nock(config.PAYMENTS_URI);
    });

    it('works', done => {
      const query = intoUrlParams({
        auth_flow_type: 'redirect',
        account_type: 'sort_code_account_number',
        currency: 'GBP',
        release_channel: 'live',
        client_id: config.CLIENT_ID
      });

      paymentsApi.get(`/single-immediate-payments-providers?${query}`).times(1).reply(200, mockProvidersResponse);

      expectedProvidersResponse.results = expectedProvidersResponse.results.concat(fillerSandboxProviders);
      request.get('/providers').expect(200, expectedProvidersResponse, done);
    });
  });
});
