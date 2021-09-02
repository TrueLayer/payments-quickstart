import app from 'app';
import nock, { Scope } from 'nock';
import supertest, { SuperTest } from 'supertest';
import { mockPaymentResponse } from './mock-payment-response';
import fakePaymentApiRequest, { fakePaymentRequest } from './mock-payment-request';
import config from 'config';

let request: SuperTest<any>;

beforeEach(() => {
  request = supertest(app);

  nock(config.AUTH_URI, {
    reqheaders: { 'content-type': 'application/json' }
  })
    .post('/connect/token')
    .reply(200, { access_token: 'access_token', expires_in: 3600, token_type: 'bearer' });
});

describe('api v3', () => {
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
      request.get('/v3/payment/1').expect(501, {}, done);
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
      request.post('/v3/payment').send(fakePaymentRequest()).expect(501, {}, done);
    });
  });
});
