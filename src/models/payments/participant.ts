/* eslint-disable camelcase */

export interface SortCode {
    type: string,
    sort_code: string,
    account_number: string,
}

export interface Iban {
    type: string,
    iban: string
}

export interface Bban {
    type: string,
    bban: string
}

export interface Nrb {
    type: string,
    nrb: string
}

export type AccountDetails = SortCode | Iban | Bban | Nrb;

export interface Participant {
    name: string,
    account: AccountDetails
}

export default Participant;
