import PaymentResponse from '../models/payments/response';
import { SortCode } from '../models/payments/participant';
import paymentResponseJson from './mock-payment-response';

test('payment response serializes & de-serializes.', () => {
  // Arrange
  const json = paymentResponseJson;

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
  expect(result.auth_flow.type).toBe('redirect');
  expect(result.auth_flow.uri).toBe('https://www.eg-provider.com/authorize?token=0f9e8d7c');

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
