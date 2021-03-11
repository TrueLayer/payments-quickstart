export interface Provider {
  provider_id: string;
  logo_url: string;
  icon_url: string;
  display_name: string;
  country: string;
  release_stage: string;
  enabled: boolean;
}

export interface ProvidersResponse {
  results: Provider[];
}
