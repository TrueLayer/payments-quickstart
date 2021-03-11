/* eslint-disable camelcase */

import { AuthFlowRedirectResponse } from './auth-flow';
import Participant from './participant';
import References from './references';

export type PaymentStatus = 'initiated' | 'cancelled' | 'authorisation_failed' | 'executing' | 'rejected' | 'executed' | 'expired';

export type SupportedCurrency = 'GBP' | 'EUR';

export type AccountType = 'sort_code_account_number';

export type ReleaseChannel = 'live' | 'public_beta' | 'private_beta';

export interface PaymentResponse {
  single_immediate_payment_id: string;
  status: PaymentStatus;
  initiated_at: Date;
  amount_in_minor: number;
  currency: SupportedCurrency;
  provider_id: string;
  scheme_id: string;
  fee_option_id: string;
  beneficiary: Participant;
  remitter: Participant;
  references: References;
  auth_flow: AuthFlowRedirectResponse;
}
export interface PaymentResponseResult {
  result: PaymentResponse;
}

export default PaymentResponseResult;
