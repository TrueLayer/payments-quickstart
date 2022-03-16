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
      paymentsApi = nock(config.PAYMENTS_V3_URI);
    });

    it('200 GET payment response from payments api is returned successfully through the proxy.', done => {
      const status = mockStatusResponse;

      paymentsApi.get('/payments/313e586f-bbeb-4679-974d-a132a34dae99').times(1).reply(200, status);
      // Act & Assert
      request.get('/v3/payment/313e586f-bbeb-4679-974d-a132a34dae99').send().expect(200, mockStatusResponse, done);
    });
  });

  describe('POST creation ', () => {
    let paymentsApi: Scope;

    beforeEach(() => {
      paymentsApi = nock(config.PAYMENTS_V3_URI, {
        reqheaders: {
          'authorization': 'Bearer access_token',
          'content-type': 'application/json'
        }
      });
    });

    describe('GBP `/v3/payment`', () => {
      it('Successful initiated payment from payments api is returned successfully through the proxy.', done => {
        // Arrange
        const paymentResponse = mockPaymentResponse;

        paymentsApi.post('/payments').times(1).reply(200, paymentResponse);

        // Act & Assert
        request.post('/v3/payment').send().expect(200, mockPaymentResponse, done);
      });
    });
    describe('EUR `/v3/payment/euro`', () => {
      it('Successful initiate a payment with EUR currency', done => {
        // Arrange
        const paymentResponse = mockPaymentEurResponse;

        paymentsApi.post('/payments').times(1).reply(200, paymentResponse);

        // Act & Assert
        request.post('/v3/payment/euro').send().expect(200, mockPaymentEurResponse, done);
      });
    });

    describe('with provider `/v3/payment/provider`', () => {
      it('Successful initiate a payment with a provider', done => {
        // Arrange
        const paymentResponse = mockPaymentWithProviderResponse;

        paymentsApi.post('/payments').times(1).reply(200, paymentResponse);

        // Act & Assert
        request.post('/v3/payment/provider').send().expect(200, mockPaymentWithProviderResponse, done);
      });
    });
  });
});

const mockPaymentWithProviderResponse = {
  hpp_url:
    'https://payment.t7r.dev/payments#payment_id=b3ae12f1-21fd-470e-9489-bfa7a862a918&resource_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6InBheW1lbnQiLCJjbGllbnRfaWQiOiJlbnJpY29jYXNhZGVpLWZjNjY3ZCIsImp0aSI6ImIzYWUxMmYxLTIxZmQtNDcwZS05NDg5LWJmYTdhODYyYTkxOCIsIm5iZiI6MTY0NzQ0MTA5NCwiZXhwIjoxNjQ3NDQxOTk0LCJpc3MiOiJodHRwczovL2FwaS50N3IuZGV2IiwiYXVkIjoiaHR0cHM6Ly9hcGkudDdyLmRldiJ9._j2Cn0Rp7WABS-EbmgjtntpVedpxtCyoLNagax5Jycs&return_uri=truelayer://payments_sample',
  id: 'b3ae12f1-21fd-470e-9489-bfa7a862a918',
  user: { id: '52a0a47b-9d0f-4d91-acca-fe50d0d015ca' },
  resource_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6InBheW1lbnQiLCJjbGllbnRfaWQiOiJlbnJpY29jYXNhZGVpLWZjNjY3ZCIsImp0aSI6ImIzYWUxMmYxLTIxZmQtNDcwZS05NDg5LWJmYTdhODYyYTkxOCIsIm5iZiI6MTY0NzQ0MTA5NCwiZXhwIjoxNjQ3NDQxOTk0LCJpc3MiOiJodHRwczovL2FwaS50N3IuZGV2IiwiYXVkIjoiaHR0cHM6Ly9hcGkudDdyLmRldiJ9._j2Cn0Rp7WABS-EbmgjtntpVedpxtCyoLNagax5Jycs'
};

const mockPaymentEurResponse = {
  hpp_url:
    'https://payment.t7r.dev/payments#payment_id=764fb58a-55a4-4d65-9462-66af2958b905&resource_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJwZW5ueWRldi1lNTkzOGEiLCJqdGkiOiIzMTNlNTg2Zi1iYmViLTQ2NzktOTc0ZC1hMTMyYTM0ZGFlOTkiLCJuYmYiOjE2MzA1NjgzOTUsImV4cCI6MTYzMDU3MTk5NSwiaXNzIjoiaHR0cHM6Ly9hcGkudDdyLmRldiIsImF1ZCI6Imh0dHBzOi8vYXBpLnQ3ci5kZXYifQ.acqlq2lI1UbF-NyUGa57QU9P1faOYmjF-2BGpgfDnok&return_uri=truelayer://payments_sample',
  id: '764fb58a-55a4-4d65-9462-66af2958b905',
  amount_in_minor: 1,
  currency: 'EUR',
  user: { id: '9a779a8f-5dd9-4683-9ac7-f797c16428aa' },
  payment_method: {
    type: 'bank_transfer',
    beneficiary: { type: 'external_account', account_holder_name: 'fede', reference: 'fede' }
  },
  status: 'authorization_required'
};

const mockPaymentResponse = {
  hpp_url:
    'https://payment.t7r.dev/payments#payment_id=313e586f-bbeb-4679-974d-a132a34dae99&resource_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJwZW5ueWRldi1lNTkzOGEiLCJqdGkiOiIzMTNlNTg2Zi1iYmViLTQ2NzktOTc0ZC1hMTMyYTM0ZGFlOTkiLCJuYmYiOjE2MzA1NjgzOTUsImV4cCI6MTYzMDU3MTk5NSwiaXNzIjoiaHR0cHM6Ly9hcGkudDdyLmRldiIsImF1ZCI6Imh0dHBzOi8vYXBpLnQ3ci5kZXYifQ.acqlq2lI1UbF-NyUGa57QU9P1faOYmjF-2BGpgfDnok&return_uri=truelayer://payments_sample',
  id: '313e586f-bbeb-4679-974d-a132a34dae99',
  amount_in_minor: 1,
  currency: 'GBP',
  beneficiary: {
    type: 'external_account',
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
    type: 'external_account',
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
