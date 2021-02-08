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

type AccountDetails = SortCode | Iban | Bban | Nrb;

interface Participant {
    name: string,
    account: AccountDetails
}

interface SeparateReference {
    type: string,
    beneficiary: string,
    remitter: string
}

interface SingleReference {
    type: string,
    reference: string
}

type References = SingleReference | SeparateReference;

type PaymentStatus = (
    'initiated' |
    'cancelled' |
    'authorisation_failed' |
    'executing' |
    'rejected' |
    'executed' |
    'expired'
);

type SupportedCurrency = 'GBP' | 'EUR';

export interface PaymentResponse {
    single_immediate_payment_id: string,
    status: PaymentStatus,
    initiated_at: Date,
    amount_in_minor: number,
    currency: SupportedCurrency,
    provider_id: string,
    scheme_id: string,
    fee_option_id: string,
    beneficiary: Participant,
    remitter: Participant,
    references: References
}
export interface PaymentResponseResult {
    result: PaymentResponse
}

export default PaymentResponseResult;
