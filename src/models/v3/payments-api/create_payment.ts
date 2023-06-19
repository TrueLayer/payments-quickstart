import z from 'zod';
import { currencyCodeSchema, paymentAccountIdentifierSchema, providerFilterSchema } from './common';

export type ProviderFilter = z.infer<typeof providerFilterSchema>;

const beneficiarySchema = z.object({
  type: z.literal('external_account'),
  account_identifier: paymentAccountIdentifierSchema,
  account_holder_name: z.string(),
  reference: z.string()
});

const schemeSelectionIntantOnlySchema = z.object({
  type: z.literal('instant_only'),
  allow_remitter_fee: z.boolean().optional()
});

const schemeSelectionIntantPreferredSchema = z.object({
  type: z.literal('instant_preferred'),
  allow_remitter_fee: z.boolean().optional()
});

const schemeSelectionUserSelectedSchema = z.object({
  type: z.literal('user_selected')
});

const providerSelectionUserSelectedSchema = z.object({
  type: z.literal('user_selected'),
  filter: providerFilterSchema,
  scheme_selection: z
    .discriminatedUnion('type', [
      schemeSelectionIntantOnlySchema,
      schemeSelectionIntantPreferredSchema,
      schemeSelectionUserSelectedSchema
    ])
    .optional()
});

const providerSelectionPreSelectedSchema = z.object({
  type: z.literal('preselected'),
  provider_id: z.string(),
  scheme_id: z.string(),
  scheme_selection: z
    .discriminatedUnion('type', [
      schemeSelectionIntantOnlySchema,
      schemeSelectionIntantPreferredSchema,
      schemeSelectionUserSelectedSchema
    ])
    .optional()
});

const providerSelectionSchema = z.discriminatedUnion('type', [
  providerSelectionPreSelectedSchema,
  providerSelectionUserSelectedSchema
]);

const paymentMethodSchema = z.object({
  type: z.literal('bank_transfer'),
  provider_selection: providerSelectionSchema,
  beneficiary: beneficiarySchema
});

const userSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phone: z.string()
});

/**
 * It defines a request to create a payment.
 */
const createPaymentRequestSchema = z.object({
  amount_in_minor: z.number(),
  currency: z.string(),
  payment_method: paymentMethodSchema,
  user: userSchema
});

export type CreatePaymentRequest = z.infer<typeof createPaymentRequestSchema>;

/**
 * It defines the response of a create payment request
 */
const createPaymentRequestResponseSchema = z.object({
  id: z.string(),
  amount_in_minor: z.number(),
  currency: currencyCodeSchema,
  payment_method: paymentMethodSchema,
  beneficiary: beneficiarySchema,
  status: z.string(),
  resource_token: z.string()
});

export type CreatePaymentRequestResponse = z.infer<typeof createPaymentRequestResponseSchema>;
