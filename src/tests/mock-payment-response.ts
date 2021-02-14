export const json = `{
    "result": {
        "single_immediate_payment_id": "dcc3e785-76d3-415c-8bd7-553f17f49c4a",
        "status": "initiated",
        "initiated_at": "2020-10-13T10:01:23.381802",
        "amount_in_minor": 120000,
        "currency": "GBP",
        "provider_id": "eg-provider",
        "scheme_id": "payment_scheme",
        "fee_option_id": "split_fee",
        "beneficiary": {
            "account": {
                "type": "sort_code_account_number",
                "sort_code": "234567",
                "account_number": "23456789"
            },
            "name": "Financial Services Ltd"
        },
        "remitter": {
            "account": {
                "type": "sort_code_account_number",
                "sort_code": "987654",
                "account_number": "98765432"
            },
            "name": "Mike Smith"
        },
        "references": {
            "type": "separate",
            "beneficiary": "FinServ-1a2b3c4d",
            "remitter": "FS-1000001"
        },
        "auth_flow": {
            "type": "redirect",
            "uri": "https://www.eg-provider.com/authorize?token=0f9e8d7c",
            "expiry": "2020-11-03T23:00:00.000Z"
        }
    }
}`;

export const mockPaymentResponse = () => JSON.parse(json);

export default json;
