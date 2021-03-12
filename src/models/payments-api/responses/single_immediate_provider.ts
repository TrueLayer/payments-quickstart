/* eslint-disable camelcase */

export interface SingleImmediateProvider {
  provider_id: string;
  logo_url: string;
  icon_url: string;
  display_name: string;
  country: string;
  release_stage: string;
}

export interface SingleImmediateProviderResponse {
  results: SingleImmediateProvider[];
}

export default SingleImmediateProviderResponse;
