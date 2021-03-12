/* eslint-disable camelcase */

import { PaymentStatus, SupportedCurrency, Participant, References } from 'models/payments-api/common';

interface AuthFlow {
  type: 'redirect';
  uri: string;
  expiry?: Date;
}

interface SingleImmediatePayment {
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
  auth_flow: AuthFlow;
}

export interface SingleImmediatePaymentResponse {
  result: SingleImmediatePayment;
}

export default SingleImmediatePaymentResponse;
