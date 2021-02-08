/* eslint-disable camelcase */

interface SortCode {
    type: string,
    sort_code: string,
    account_number: string,
}

interface Iban {
    type: string,
    iban: string
}

interface Bban {
    type: string,
    bban: string
}

interface Nrb {
    type: string,
    nrb: string
}

export type AccountDetails = SortCode | Iban | Bban | Nrb;

export interface Participant {
    name: string,
    account: AccountDetails
}

export default Participant;