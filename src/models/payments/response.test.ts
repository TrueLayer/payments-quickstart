import PaymentResponse from './response';
import { SortCode } from './participant';

test('payment response serializes & de-serializes.', () => {
  // Arrange
  const json = `{
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
          }
        }
    }`;

  // Act
  const response: PaymentResponse = JSON.parse(json);
  const result = response.result;

  // Assert
  expect(result.amount_in_minor).toBe(120000);
  expect(result.fee_option_id).toBe('split_fee');
  expect(result.currency).toBe('GBP');
  expect(result.initiated_at).toBe('2020-10-13T10:01:23.381802');
  expect(result.provider_id).toBe('eg-provider');
  expect(result.scheme_id).toBe('payment_scheme');
  expect(result.fee_option_id).toBe('split_fee');

  expect(result.beneficiary.name).toBe('Financial Services Ltd');
  switch (result.beneficiary.account.type) {
    case 'sort_code_account_number': {
      const beneficiary = result.beneficiary.account as SortCode;
      expect(beneficiary.sort_code).toBe('234567');
      expect(beneficiary.account_number).toBe('23456789');
      break;
    }
    default:
      throw new Error('Expected `sort_code` type.');
  }

  expect(result.remitter.name).toBe('Mike Smith');
  switch (result.remitter.account.type) {
    case 'sort_code_account_number': {
      const beneficiary = result.remitter.account as SortCode;
      expect(beneficiary.sort_code).toBe('987654');
      expect(beneficiary.account_number).toBe('98765432');
      break;
    }
    default:
      throw new Error('Expected `sort_code` type.');
  }

  expect(JSON.stringify(response)).toBe(JSON.stringify(JSON.parse(json)));
});
