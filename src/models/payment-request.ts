/* eslint-disable camelcase */

import config from 'config';
import { v4 as uuid } from 'uuid';
import { AdditionalInputValues, SupportedCurrency } from 'models/v2/payments-api/common';
import { SingleImmediatePaymentRequest } from 'models/v2/payments-api/requests';
import { isTypeOf } from 'utils';

export interface PaymentRequest {
  provider_id: string;
  currency?: SupportedCurrency;
  amount_in_minor?: number;
  reference?: string;
  scheme_id?: string;
  payment_id?: string;
  additional_inputs?: AdditionalInputValues;
}

// Dynamic type check to validate request.
export const isPaymentRequest = (obj: any): obj is PaymentRequest => {
  const invalidParam = [
    isTypeOf(obj.provider_id, ['string']),
    isTypeOf(obj.currency, ['string', 'undefined']),
    isTypeOf(obj.amount_in_minor, ['number', 'undefined']),
    isTypeOf(obj.reference, ['string', 'undefined']),
    isTypeOf(obj.scheme_id, ['string', 'undefined']),
    isTypeOf(obj.payment_id, ['string', 'undefined']),
    isTypeOf(obj.additional_inputs, ['object', 'undefined'])
  ].some(isType => !isType);

  return !invalidParam;
};

export const intoSingleImmediatePaymentRequest = ({
  provider_id,
  scheme_id = 'faster_payments_service',
  currency = 'GBP',
  amount_in_minor = 1,
  reference = 'Test Payment',
  payment_id = uuid(),
  additional_inputs
}: PaymentRequest): SingleImmediatePaymentRequest => ({
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
    return_uri: config.REDIRECT_URI,
    additional_inputs: additional_inputs
  },
  webhook_uri: config.WEBHOOK_URI || null
});

export default SingleImmediatePaymentRequest;
