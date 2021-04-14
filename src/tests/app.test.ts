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
import disabledSandboxProviders from 'models/payments/sandbox-providers-response';

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

    it('200 GET payment response from payments api is returned successfully through the proxy.', done => {
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

    it('Successful initiated payment from payments api is returned successfully through the proxy.', done => {
      // Arrange
      const expectedBody = JSON.stringify(fakePaymentApiRequest());
      const paymentResponse = mockPaymentResponse();

      paymentsApi
        .post('/single-immediate-payment-initiation-requests', expectedBody)
        .times(1)
        .reply(200, paymentResponse);

      // Act & Assert
      request.post('/payment').send(fakePaymentRequest()).expect(200, paymentResponse, done);
    });

    it('Only requires `provider_id` as a paramter', done => {
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

    it('invalid parameters returns a 400', done => {
      request.post('/payment').send({}).expect(400, done);
    });
  });

  describe('GET `/providers`', () => {
    let paymentsApi: Scope;
    const paymentsUri = config.PAYMENTS_URI;

    beforeEach(() => {
      paymentsApi = nock(config.PAYMENTS_URI);
    });

    afterEach(() => {
      config.PAYMENTS_URI = paymentsUri;
    });

    it('Non sandbox env returns expected providers.', done => {
      config.PAYMENTS_URI = 'https://truelayer.com/v2';

      const query = intoUrlParams({
        auth_flow_type: 'redirect',
        account_type: 'sort_code_account_number',
        currency: 'GBP',
        release_channel: 'alpha',
        client_id: config.CLIENT_ID
      });

      paymentsApi.get(`/single-immediate-payments-providers?${query}`).times(1).reply(200, mockProvidersResponse);
      request.get('/providers').expect(200, expectedProvidersResponse, done);
    });

    it('sandbox env concatenates disabled providers to api response.', done => {
      // Arrange
      config.PAYMENTS_URI = 'https://pay-api.truelayer-sandbox.com/v2';

      const query = intoUrlParams({
        auth_flow_type: 'redirect',
        account_type: 'sort_code_account_number',
        currency: 'GBP',
        release_channel: 'alpha',
        client_id: config.CLIENT_ID
      });

      // Act & Assert
      paymentsApi.get(`/single-immediate-payments-providers?${query}`).times(1).reply(200, mockProvidersResponse);
      // Check disabled sandbox providers are added to the response.
      expectedProvidersResponse.results = expectedProvidersResponse.results.concat(disabledSandboxProviders);
      request.get('/providers').expect(200, expectedProvidersResponse, done);
    });
  });
});
