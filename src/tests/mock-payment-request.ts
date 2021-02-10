import PaymentRequest from 'models/payments/request';

export const fakePaymentRequest = () => ({
  single_immediate_payment: {
    provider_id: 'provider',
    scheme_id: 'faseter_payments_scheme',
    currency: 'GBP',
    amount_in_minor: 100,
    remitter: {
      name: 'Rem',
      account: { type: 'iban', iban: 'iban' }
    },
    beneficiary: {
      name: 'Ben',
      account: { type: 'iban', iban: 'iban' }
    },
    references: {
      type: 'single',
      reference: 'reference'
    }
  },
  auth_flow: {
    type: 'redirect',
    return_uri: 'https://server.com/hook',
    additional_inputs: {}
  }
} as PaymentRequest);

export default fakePaymentRequest;
