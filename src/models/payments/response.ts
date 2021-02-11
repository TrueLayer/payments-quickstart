/* eslint-disable camelcase */

import Participant from './participant';
import References from './references';

export type PaymentStatus = 'initiated' | 'cancelled' | 'authorisation_failed' | 'executing' | 'rejected' | 'executed' | 'expired';

export type SupportedCurrency = 'GBP' | 'EUR';

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
}
export interface PaymentResponseResult {
  result: PaymentResponse;
}

export default PaymentResponseResult;
