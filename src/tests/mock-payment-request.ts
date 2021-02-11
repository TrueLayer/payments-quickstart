import PaymentApiRequest, { buildPaymentApiRequest, PaymentRequest } from 'models/payments/request';

export const fakePaymentRequest = (): PaymentRequest => ({
  scheme_id: 'faster_payments_scheme',
  provider_id: 'provider_id',
  currency: 'GBP',
  amount_in_minor: 100,
  reference: 'reference'
});

export const fakePaymentApiRequest = (): PaymentApiRequest => buildPaymentApiRequest(fakePaymentRequest());

export default fakePaymentApiRequest;
