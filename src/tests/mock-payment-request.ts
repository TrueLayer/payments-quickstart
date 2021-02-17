import PaymentApiRequest, { buildPaymentApiRequest, PaymentRequest } from 'models/payments/request';

export const fakePaymentRequest = (): PaymentRequest => ({
  provider_id: 'provider_id',
  currency: 'GBP',
  amount_in_minor: 100,
  reference: 'reference',
  payment_id: '12345'
});

export const fakePaymentApiRequest = (): PaymentApiRequest => buildPaymentApiRequest(fakePaymentRequest());

export default fakePaymentApiRequest;
