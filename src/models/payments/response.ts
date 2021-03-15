import { SingleImmediateProvider, SingleImmediateProviderResponse } from 'models/payments-api/responses';
import disabledSandboxProviders from 'models/payments/sandbox-providers-response';
import config from 'config';

export interface Provider extends SingleImmediateProvider {
  enabled: boolean;
}

const intoProviderFromApiResponse = (provider: SingleImmediateProvider): Provider => ({
  provider_id: provider.provider_id,
  display_name: provider.display_name,
  logo_url: provider.logo_url,
  icon_url: provider.icon_url,
  country: provider.country,
  release_stage: provider.release_stage,
  enabled: true
});

export interface ProvidersResponse {
  results: Provider[];
}

export const intoProvidersResponseFromApiResponse = (response: SingleImmediateProviderResponse): ProvidersResponse => {
  const results = response.results
    .map(provider => intoProviderFromApiResponse(provider))
    .concat(
      // Inject some disabled providers if using sandbox as providers list is sparse at the moment.
      config.PAYMENTS_URI.includes('sandbox') ? disabledSandboxProviders : []
    );

  return { results };
};

export default ProvidersResponse;
