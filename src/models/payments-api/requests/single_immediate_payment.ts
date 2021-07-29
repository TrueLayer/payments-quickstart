/* eslint-disable camelcase */
import { SupportedCurrency, Participant, References } from 'models/payments-api/common';

// Currently only supporting `redirect` payment flow for sample app.
interface AuthFlow {
  type: 'redirect';
  return_uri: string;
  psu_ip_address?: string;
  data_access_token?: string;
  additional_inputs?: Map<String, String>;
}

interface SingleImmediatePayment {
  single_immediate_payment_id: string;
  provider_id: string;
  scheme_id?: string;
  fee_option_id?: string;
  currency: SupportedCurrency;
  amount_in_minor: number;
  beneficiary: Participant;
  remitter?: Participant;
  references: References;
}

export interface SingleImmediatePaymentRequest {
  auth_flow: AuthFlow;
  single_immediate_payment: SingleImmediatePayment;
  webhook_uri?: string | null;
}

export default SingleImmediatePaymentRequest;
