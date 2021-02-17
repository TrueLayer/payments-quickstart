/* eslint-disable camelcase */

import config from 'config';
import { v4 as uuid } from 'uuid';

import Participant from './participant';
import References from './references';
import { SupportedCurrency } from './response';
import { AuthFlowRedirectRequest } from './auth-flow';

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

interface PaymentApiRequest {
  auth_flow: AuthFlowRedirectRequest;
  single_immediate_payment: SingleImmediatePayment;
  webhook_uri?: string | null;
}

export interface PaymentRequest {
  provider_id: string;
  currency?: SupportedCurrency;
  amount_in_minor?: number;
  reference?: string;
  scheme_id?: string;
  payment_id?: string;
}

export const buildPaymentApiRequest = ({
  scheme_id,
  provider_id,
  currency = 'GBP',
  amount_in_minor = 1,
  reference = 'Test Payment',
  payment_id = uuid()
}: PaymentRequest): PaymentApiRequest => ({
  single_immediate_payment: {
    single_immediate_payment_id: payment_id,
    provider_id,
    scheme_id,
    currency,
    amount_in_minor,
    beneficiary: {
      name: config.BENEFICIARY_NAME,
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
  webhook_uri: config.WEBHOOK_URI || null
});

export default PaymentApiRequest;
