import { intoSingleImmediatePaymentRequest, PaymentRequest } from 'models/payment-request';
import { SingleImmediatePaymentRequest } from 'models/payments-api/requests';

export const fakePaymentRequest = (): PaymentRequest => ({
  provider_id: 'provider_id',
  currency: 'GBP',
  amount_in_minor: 100,
  reference: 'reference',
  payment_id: '12345',
  additional_inputs: {
    username: 'username'
  }
});

export const fakePaymentApiRequest = (): SingleImmediatePaymentRequest =>
  intoSingleImmediatePaymentRequest(fakePaymentRequest());

export default fakePaymentApiRequest;
