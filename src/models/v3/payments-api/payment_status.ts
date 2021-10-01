/* eslint-disable camelcase */
import { Beneficiary, PaymentMethod } from './create_payment';
/**
 * It defines a payment status
 */
export interface PaymentStatus {
  id: string;
  amount_in_minor: number;
  currency: string;
  payment_method: PaymentMethod;
  beneficiary: Beneficiary;
  created_at: string;
  status: string;
}
