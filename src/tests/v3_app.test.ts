import app from '../app';
import nock, { Scope } from 'nock';
import supertest, { SuperTest } from 'supertest';
import config from '../config';

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
  describe('GET `/v3/payments:id`', () => {
    let paymentsApi: Scope;

    beforeEach(() => {
      paymentsApi = nock(config.PAYMENTS_V3_URI, {
        reqheaders: {
          'authorization':
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJwZW5ueWRldi1lNTkzOGEiLCJqdGkiOiIzMTNlNTg2Zi1iYmViLTQ2NzktOTc0ZC1hMTMyYTM0ZGFlOTkiLCJuYmYiOjE2MzA1NjgzOTUsImV4cCI6MTYzMDU3MTk5NSwiaXNzIjoiaHR0cHM6Ly9hcGkudDdyLmRldiIsImF1ZCI6Imh0dHBzOi8vYXBpLnQ3ci5kZXYifQ.acqlq2lI1UbF-NyUGa57QU9P1faOYmjF-2BGpgfDnok',
          'content-type': 'application/json'
        }
      });
    });

    it('200 GET payment response from payments api is returned successfully through the proxy.', done => {
      const status = mockStatusResponse;

      paymentsApi.get('/payments/313e586f-bbeb-4679-974d-a132a34dae99').times(1).reply(200, status);
      // Act & Assert
      request
        .get('/v3/payment/313e586f-bbeb-4679-974d-a132a34dae99')
        .set(
          'authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJwZW5ueWRldi1lNTkzOGEiLCJqdGkiOiIzMTNlNTg2Zi1iYmViLTQ2NzktOTc0ZC1hMTMyYTM0ZGFlOTkiLCJuYmYiOjE2MzA1NjgzOTUsImV4cCI6MTYzMDU3MTk5NSwiaXNzIjoiaHR0cHM6Ly9hcGkudDdyLmRldiIsImF1ZCI6Imh0dHBzOi8vYXBpLnQ3ci5kZXYifQ.acqlq2lI1UbF-NyUGa57QU9P1faOYmjF-2BGpgfDnok'
        )
        .send()
        .expect(200, mockStatusResponse, done);
    });
  });

  describe('POST `/v3/payments`', () => {
    let paymentsApi: Scope;

    beforeEach(() => {
      paymentsApi = nock(config.PAYMENTS_V3_URI, {
        reqheaders: {
          'authorization': 'Bearer access_token',
          'content-type': 'application/json'
        }
      });
    });

    it('Successful initiated payment from payments api is returned successfully through the proxy.', done => {
      // Arrange
      const paymentResponse = mockPaymentResponse;

      paymentsApi.post('/payments').times(1).reply(200, paymentResponse);

      // Act & Assert
      request.post('/v3/payment').send().expect(200, mockPaymentResponse, done);
    });
  });
});

const mockPaymentResponse = {
  id: '313e586f-bbeb-4679-974d-a132a34dae99',
  amount_in_minor: 1,
  currency: 'GBP',
  beneficiary: {
    type: 'external',
    scheme_identifier: {
      type: 'sort_code_account_number',
      sort_code: '123456',
      account_number: '12345678'
    },
    name: 'John Doe',
    reference: 'Test Ref'
  },
  payment_method: {
    type: 'bank_transfer',
    statement_reference: 'some ref'
  },
  resource_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJwZW5ueWRldi1lNTkzOGEiLCJqdGkiOiIzMTNlNTg2Zi1iYmViLTQ2NzktOTc0ZC1hMTMyYTM0ZGFlOTkiLCJuYmYiOjE2MzA1NjgzOTUsImV4cCI6MTYzMDU3MTk5NSwiaXNzIjoiaHR0cHM6Ly9hcGkudDdyLmRldiIsImF1ZCI6Imh0dHBzOi8vYXBpLnQ3ci5kZXYifQ.acqlq2lI1UbF-NyUGa57QU9P1faOYmjF-2BGpgfDnok',
  status: 'authorization_required'
};

const mockStatusResponse = {
  id: '313e586f-bbeb-4679-974d-a132a34dae99',
  amount_in_minor: 1,
  currency: 'GBP',
  beneficiary: {
    type: 'external',
    scheme_identifier: {
      type: 'sort_code_account_number',
      sort_code: '123456',
      account_number: '12345678'
    },
    name: 'John Doe',
    reference: 'Test Ref'
  },
  payment_method: {
    type: 'bank_transfer',
    statement_reference: 'some ref'
  },
  resource_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJwZW5ueWRldi1lNTkzOGEiLCJqdGkiOiIzMTNlNTg2Zi1iYmViLTQ2NzktOTc0ZC1hMTMyYTM0ZGFlOTkiLCJuYmYiOjE2MzA1NjgzOTUsImV4cCI6MTYzMDU3MTk5NSwiaXNzIjoiaHR0cHM6Ly9hcGkudDdyLmRldiIsImF1ZCI6Imh0dHBzOi8vYXBpLnQ3ci5kZXYifQ.acqlq2lI1UbF-NyUGa57QU9P1faOYmjF-2BGpgfDnok',
  created_at: '2020-09-28T17:17:17',
  status: 'authorization_required'
};
