/* eslint-disable camelcase */

// Payment Method Details

export type PaymentMethodType = 'bank_transfer';

interface PaymentMethod {
  type: PaymentMethodType;
  statement_reference: string;
}

// Beneficiary Details

export type BeneficiaryType = 'external';

export type SchemeIdentifierType = 'sort_code_account_number';

interface Beneficiary {
  type: BeneficiaryType;
  scheme_identifier: {
    type: SchemeIdentifierType;
    sort_code: string;
    account_number: string;
  };
  name: string;
  reference: string;
}

export interface CreatePaymentRequest {
  id: string;
  amount_in_minor: number;
  currency: string;
  payment_method: PaymentMethod;
  beneficiary: Beneficiary;
}

export interface CreatePaymentRequestReponse {
  id: string;
  amount_in_minor: number;
  currency: string;
  payment_method: PaymentMethod;
  beneficiary: Beneficiary;
  status: string;
  resource_token: string;
}
