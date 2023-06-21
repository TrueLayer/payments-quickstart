import * as z from 'zod';

export enum MandateFailureStage {
  AuthorizationRequired = 'authorization_required',
  Authorized = 'authorized',
  Authorizing = 'authorizing',
  Revoked = 'revoked'
}

export const mandateFailureStageSchema = z.nativeEnum(MandateFailureStage);

export const metadataSchema = z.record(z.string());

export enum CurrencyCode {
  GBP = 'GBP',
  EUR = 'EUR'
}

export const currencyCodeSchema = z.nativeEnum(CurrencyCode);

enum CustomerSegment {
  Retail = 'retail',
  Business = 'business',
  Corporate = 'corporate'
}

const customerSegmentSchema = z.nativeEnum(CustomerSegment);

export const providerFilterSchema = z
  .object({
    countries: z.array(z.string()),
    release_channel: z.union([
      z.literal('general_availability'),
      z.literal('public_beta'),
      z.literal('private_beta'),
      z.literal('alpha')
    ]),
    customer_segments: z.array(customerSegmentSchema),
    provider_ids: z.array(z.string()),
    excludes: z.object({
      provider_ids: z.array(z.string())
    })
  })
  .deepPartial();

export type ProviderSelectionFilter = z.infer<typeof providerFilterSchema>;

export const accountIdentifierScanSchema = z.object({
  type: z.literal('sort_code_account_number'),
  sort_code: z.string(),
  account_number: z.string()
});

export const accountIdentifierIbanSchema = z.object({
  type: z.literal('iban'),
  iban: z.string()
});

export const paymentAccountIdentifierSchema = z.discriminatedUnion('type', [
  accountIdentifierScanSchema,
  accountIdentifierIbanSchema
]);

export type PaymentAccountIdentifier = z.infer<typeof paymentAccountIdentifierSchema>;

export const remitterSchema = z.object({
  account_holder_name: z.string(),
  account_identifier: paymentAccountIdentifierSchema
});

export const mandateProviderSelectionPreselectedSchema = z.object({
  type: z.literal('preselected'),
  provider_id: z.string(),
  remitter: remitterSchema.optional()
});

export enum PeriodAlignment {
  Consent = 'consent',
  Calendar = 'calendar'
}

const periodAlignmentSchema = z.nativeEnum(PeriodAlignment);

export const mandatePeriodicLimitSchema = z.object({
  maximum_amount: z.number(),
  period_alignment: periodAlignmentSchema
});

export const mandateConstraintsSchema = z.object({
  valid_from: z.string().optional(),
  valid_to: z.string().optional(),
  maximum_individual_amount: z.number(),
  periodic_limits: z
    .object({
      day: mandatePeriodicLimitSchema,
      week: mandatePeriodicLimitSchema,
      fortnight: mandatePeriodicLimitSchema,
      month: mandatePeriodicLimitSchema,
      half_year: mandatePeriodicLimitSchema,
      year: mandatePeriodicLimitSchema
    })
    .deepPartial()
});

export const mandateDestinationExternalAccountSchema = z.object({
  type: z.literal('external_account'),
  account_holder_name: z.string(),
  account_identifier: paymentAccountIdentifierSchema
});

export const mandateDestinationMerchantAccountSchema = z.object({
  type: z.literal('merchant_account'),
  merchant_account_id: z.string(),
  account_holder_name: z.string().optional()
});

export const mandatePaymentDestinationSchema = z.discriminatedUnion('type', [
  mandateDestinationMerchantAccountSchema,
  mandateDestinationExternalAccountSchema
]);
