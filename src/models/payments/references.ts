export interface SeparateReference {
    type: string,
    beneficiary: string,
    remitter: string
}

export interface SingleReference {
    type: string,
    reference: string
}

export type References = SingleReference | SeparateReference;

export default References;