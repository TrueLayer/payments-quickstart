import app from 'app';
import nock from 'nock';
import supertest, { SuperTest } from 'supertest';
import { mockPaymentResponse } from './mock-payment-response';
import mockPaymentRequest from './mock-payment-request';

let request: SuperTest<any>;

beforeEach(() => {
  request = supertest(app);

  nock('https://auth.t7r.dev', {
    reqheaders: { 'content-type': 'application/json' }
  })
    .post('/connect/token')
    .reply(200, { access_token: 'access_token', expires_in: 3600, token_type: 'bearer' });
});

describe('api', () => {
  describe('GET `/payments:id`', () => {
    beforeEach(() => {
      nock('https://pay-api.t7r.dev/v2', {
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
  });

  describe('POST `/payments`', () => {
    beforeEach(() => {
      nock('https://pay-api.t7r.dev/v2', {
        reqheaders: {
          'authorization': 'Bearer access_token',
          'content-type': 'application/json'
        }
      })
        .post('/single-immediate-payment-initiation-requests', JSON.stringify(mockPaymentRequest()))
        .reply(200, mockPaymentResponse());
    });

    it('', done => {
      request.post('/payment')
        .send(mockPaymentRequest())
        .expect(200, mockPaymentResponse(), done);
    });
  });
});
