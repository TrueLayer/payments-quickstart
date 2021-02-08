/* eslint-disable camelcase */

interface Account {
  type: string;
  sort_code: string;
  account_number: string;
}

interface Participant {
  account: Account;
  name: string;
}

interface References {
  type: string;
  beneficiary: string;
  remitter: string;
}

interface SingleImmediatePayment {
  provider_id: string;
  scheme_id: null;
  fee_option_id: null;
  currency: string;
  amount_in_minor: string;
  beneficiary: Participant;
  remitter: Participant;
  references: References;
}

interface AdditionalInputs { }

interface AuthFlow {
  type: string;
  direct_return: boolean;
  additional_inputs: AdditionalInputs;
  psu_ip_address: boolean;
  data_access_token: null;
}

interface PaymentRequest {
  client_key: string;
  auth_flow: AuthFlow;
  single_immediate_payment: SingleImmediatePayment;
  terms_of_service_accepted: boolean;
}

export default PaymentRequest;
