import * as z from 'zod';
import {
  currencyCodeSchema,
  mandateFailureStageSchema,
  mandateProviderSelectionPreselectedSchema,
  metadataSchema,
  providerFilterSchema,
  mandateConstraintsSchema,
  mandatePaymentDestinationSchema
} from './common';

export enum RevocationSource {
  Client = 'client',
  Provider = 'provider'
}

export const revocationSourceSchema = z.nativeEnum(RevocationSource);

export const mandateProviderSelectionUserSelectedResponseSchema = z.object({
  type: z.literal('user_selected'),
  provider_id: z.string().optional(),
  filter: providerFilterSchema.optional()
});

export const mandateProviderSelectionResponseSchema = z.discriminatedUnion('type', [
  mandateProviderSelectionUserSelectedResponseSchema,
  mandateProviderSelectionPreselectedSchema
]);

export const paymentUserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional()
});

export const mandateCommonWithUserDetailsSchema = z.object({
  id: z.string(),
  currency: currencyCodeSchema,
  beneficiary: mandatePaymentDestinationSchema,
  provider_selection: mandateProviderSelectionResponseSchema,
  user: paymentUserSchema.optional(),
  created_at: z.string(),
  constraints: mandateConstraintsSchema,
  metadata: metadataSchema.optional()
});

export const providerSchema = z
  .object({
    id: z.string(),
    display_name: z.string(),
    icon_uri: z.string(),
    logo_uri: z.string(),
    bg_color: z.string(),
    country_code: z.string()
  })
  .deepPartial();

export const actionSpecProviderSelectionSchema = z.object({
  type: z.literal('provider_selection'),
  providers: z.array(providerSchema)
});

export const actionSpecRedirectSchema = z.object({
  type: z.literal('redirect'),
  uri: z.string()
});

export const actionSpecWaitForOutcomeSchema = z.object({
  type: z.literal('wait')
});

export const mandateNextActionSchema = z.discriminatedUnion('type', [
  actionSpecProviderSelectionSchema,
  actionSpecRedirectSchema,
  actionSpecWaitForOutcomeSchema
]);

export const mandateAuthorizationFlowSchema = z.object({
  actions: z.object({
    next: mandateNextActionSchema
  })
});

export const mandateAuthorizationFlowConfigurationSchema = z.object({
  provider_selection: z.object({}),
  redirect: z.object({
    return_uri: z.string()
  })
});

export const mandateAuthorizationRequiredWithUserDetailsSchema = mandateCommonWithUserDetailsSchema.merge(
  z.object({
    status: z.literal('authorization_required')
  })
);

export const mandateAuthorizingWithUserDetailsSchema = mandateCommonWithUserDetailsSchema.merge(
  z.object({
    status: z.literal('authorizing'),
    authorization_flow: mandateAuthorizationFlowSchema.merge(
      z.object({
        configuration: mandateAuthorizationFlowConfigurationSchema.optional()
      })
    )
  })
);

export const mandateAuthorizedWithUserDetailsSchema = mandateCommonWithUserDetailsSchema.merge(
  z.object({
    status: z.literal('authorized'),
    authorized_at: z.string().optional(),
    authorization_flow: z.object({
      configuration: mandateAuthorizationFlowConfigurationSchema
    })
  })
);

export const mandateFailedWithUserDetailsSchema = mandateCommonWithUserDetailsSchema.merge(
  z.object({
    status: z.literal('failed'),
    failed_at: z.string().optional(),
    failure_stage: mandateFailureStageSchema,
    failure_reason: z.string(),
    authorization_flow: z
      .object({
        configuration: mandateAuthorizationFlowConfigurationSchema
      })
      .optional()
  })
);

export const mandateRevokedWithUserDetailsSchema = mandateCommonWithUserDetailsSchema.merge(
  z.object({
    status: z.literal('revoked'),
    revocation_source: revocationSourceSchema,
    authorization_flow: z.object({
      configuration: mandateAuthorizationFlowConfigurationSchema
    }),
    authorized_at: z.string().optional(),
    revoked_at: z.string().optional()
  })
);

export const mandateResponseSchema = z.discriminatedUnion('status', [
  mandateAuthorizationRequiredWithUserDetailsSchema,
  mandateAuthorizingWithUserDetailsSchema,
  mandateAuthorizedWithUserDetailsSchema,
  mandateFailedWithUserDetailsSchema,
  mandateRevokedWithUserDetailsSchema
]);

export type MandateResponse = z.infer<typeof mandateResponseSchema>;
