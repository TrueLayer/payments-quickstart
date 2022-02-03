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

// Beneficiary Details

/**
 * The supported beneficiary types.
 */
export type BeneficiaryType = 'external_account';

/**
 * The supported scheme identifiers.
 */
export type AccountIdentifierType = 'sort_code_account_number';

export interface Beneficiary {
  type: BeneficiaryType;
  account_identifier: {
    type: AccountIdentifierType;
    sort_code: string;
    account_number: string;
  };
  account_holder_name: string;
  reference: string;
}

export type ProviderSelectionType = 'user_selected' | 'preselected';

export interface ProviderSelection {
  type: ProviderSelectionType;
  filter: ProviderFilter | null;
}

export interface PaymentMethod {
  type: PaymentMethodType;
  provider_selection: ProviderSelection;
  beneficiary: Beneficiary;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
}

/**
 * It defines a request to create a payment.
 */
export interface CreatePaymentRequest {
  amount_in_minor: number;
  currency: string;
  payment_method: PaymentMethod;
  user: User;
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
