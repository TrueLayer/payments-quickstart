import { SingleImmediateProvider } from 'models/payments-api/responses';

export interface Provider extends SingleImmediateProvider {
  enabled: boolean;
}

export const intoProviderFromApiResponse = (provider: SingleImmediateProvider) => ({
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

export default ProvidersResponse;
