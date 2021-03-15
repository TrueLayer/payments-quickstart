import { intoSingleImmediatePaymentRequest, PaymentRequest } from 'models/payments/request';
import { SingleImmediatePaymentRequest } from 'models/payments-api/requests';

export const fakePaymentRequest = (): PaymentRequest => ({
  provider_id: 'provider_id',
  currency: 'GBP',
  amount_in_minor: 100,
  reference: 'reference',
  payment_id: '12345'
});

export const fakePaymentApiRequest = (): SingleImmediatePaymentRequest =>
  intoSingleImmediatePaymentRequest(fakePaymentRequest());

export default fakePaymentApiRequest;
