/* eslint-disable camelcase */

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

export default Participant;
