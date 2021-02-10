/* eslint-disable camelcase */

import Participant from './participant';
import References from './references';
import { SupportedCurrency } from './response';

interface SingleImmediatePayment {
  provider_id: string;
  scheme_id: string;
  fee_option_id?: string;
  currency: SupportedCurrency;
  amount_in_minor: number;
  beneficiary: Participant;
  remitter: Participant;
  references: References;
}

interface AdditionalInputs { }

interface AuthFlow {
  type: string;
  return_uri: string;
  additional_inputs: AdditionalInputs;
  psu_ip_address?: string;
  data_access_token?: string;
}

interface PaymentRequest {
  auth_flow: AuthFlow;
  single_immediate_payment: SingleImmediatePayment;
  webhook_uri?: string
}

export default PaymentRequest;
