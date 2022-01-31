/* eslint-disable camelcase */

// Payment Method Details

/**
 * The supported payment methods.
 */
export type PaymentMethodType = 'bank_transfer';

export interface ProviderFilterExcludes {
  provider_ids: string[] | null;
}

export interface ProviderFilter {
  countries: string[] | null;
  release_channel: string | null;
  customer_segments: string[] | null;
  provider_ids: string[] | null;
  excludes: ProviderFilterExcludes | null;
}

export interface Provider {
  type: string;
  filter: ProviderFilter | null;
}

// Beneficiary Details

/**
 * The supported beneficiary types.
 */
export type BeneficiaryType = 'external_account';

/**
 * The supported Account identifiers.
 */
export type AccountIdentifierType = 'sort_code_account_number';

export interface Beneficiary {
  type: BeneficiaryType;
  account_identifier: {
    type: AccountIdentifierType;
    sort_code: string;
    account_number: string;
  };
  name: string;
  reference: string;
}

export interface PaymentMethod {
  type: PaymentMethodType;
  provider: Provider;
  beneficiary: Beneficiary;
}

/**
 * It defines a request to create a payment.
 */
export interface CreatePaymentRequest {
  id: string;
  amount_in_minor: number;
  currency: string;
  payment_method: PaymentMethod;
  user: unknown;
}

/**
 * It defines the response of a create payment request
 */
export interface CreatePaymentRequestResponse {
  id: string;
  amount_in_minor: number;
  currency: string;
  payment_method: PaymentMethod;
  beneficiary: Beneficiary;
  status: string;
  payment_token: string;
}
