/* eslint-disable camelcase */

export interface SeparateReference {
  type: string;
  beneficiary: string;
  remitter: string;
}

export interface SingleReference {
  type: string;
  reference: string;
}

export type References = SingleReference | SeparateReference;

export interface SortCode {
  type: 'sort_code_account_number';
  sort_code: string;
  account_number: string;
}

export interface Iban {
  type: 'iban';
  iban: string;
}

export interface Bban {
  type: 'bban';
  bban: string;
}

export interface Nrb {
  type: 'nrb';
  nrb: string;
}

export type AccountDetails = SortCode | Iban | Bban | Nrb;

export interface Participant {
  name: string;
  account: AccountDetails;
}

export type PaymentStatus =
  | 'initiated'
  | 'cancelled'
  | 'authorisation_failed'
  | 'executing'
  | 'rejected'
  | 'executed'
  | 'expired';

export type SupportedCurrency = 'GBP' | 'EUR';

export type AccountType = 'sort_code_account_number';

export type ReleaseChannel = 'live' | 'public_beta' | 'private_beta' | 'alpha';

export interface AdditionalInputValues {
  [key: string]: string;
}
