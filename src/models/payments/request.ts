/* eslint-disable camelcase */

import Participant from './participant';
import References from './references';
import { SupportedCurrency } from './response';
import config from 'config';

interface SingleImmediatePayment {
  provider_id: string;
  scheme_id: string;
  fee_option_id?: string;
  currency: SupportedCurrency;
  amount_in_minor: number;
  beneficiary: Participant;
  remitter?: Participant;
  references: References;
}

interface AdditionalInputs {}
interface AuthFlow {
  type: string;
  return_uri: string;
  additional_inputs?: AdditionalInputs;
  psu_ip_address?: string;
  data_access_token?: string;
}

interface PaymentApiRequest {
  auth_flow: AuthFlow;
  single_immediate_payment: SingleImmediatePayment;
  webhook_uri?: string;
}

export interface PaymentRequest {
  scheme_id: string;
  provider_id: string;
  currency?: SupportedCurrency;
  amount_in_minor: number;
  reference: string;
}

export const buildPaymentApiRequest = ({
  scheme_id,
  provider_id,
  currency = 'GBP',
  amount_in_minor,
  reference
}: PaymentRequest): PaymentApiRequest => ({
  single_immediate_payment: {
    provider_id,
    scheme_id,
    currency,
    amount_in_minor,
    beneficiary: {
      name: 'test',
      account: {
        type: 'sort_code_account_number',
        sort_code: config.SORT_CODE,
        account_number: config.ACCOUNT_NUMBER
      }
    },
    references: {
      type: 'single',
      reference
    }
  },
  auth_flow: {
    type: 'redirect',
    return_uri: config.REDIRECT_URI
  },
  webhook_uri: config.WEBHOOK_URI
});

export default PaymentApiRequest;
