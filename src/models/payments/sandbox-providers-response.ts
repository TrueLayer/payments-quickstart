import { Provider } from './response';

// Template disabled providers for sandbox as providers list is sparse at the moment.
export const providers: Provider[] = [
  {
    provider_id: 'ob-barclays',
    display_name: 'Barclays',
    logo_url: 'https://truelayer-client-logos.s3-eu-west-1.amazonaws.com/banks/barclays.svg',
    icon_url: 'https://truelayer-client-logos.s3-eu-west-1.amazonaws.com/banks/banks-icons/barclays-icon.svg',
    country: 'GB',
    release_stage: 'live',
    enabled: false
  },
  {
    provider_id: 'ob-halifax',
    logo_url: 'https://truelayer-client-logos.s3-eu-west-1.amazonaws.com/banks/halifax.svg',
    icon_url: 'https://truelayer-client-logos.s3-eu-west-1.amazonaws.com/banks/banks-icons/halifax-icon.svg',
    display_name: 'Halifax',
    country: 'GB',
    release_stage: 'live',
    enabled: false
  },
  {
    provider_id: 'ob-lloyds',
    logo_url: 'https://truelayer-client-logos.s3-eu-west-1.amazonaws.com/banks/lloyds.svg',
    icon_url: 'https://truelayer-client-logos.s3-eu-west-1.amazonaws.com/banks/banks-icons/lloyds-icon.svg',
    display_name: 'Lloyds',
    country: 'GB',
    release_stage: 'live',
    enabled: false
  },
  {
    provider_id: 'ob-natwest',
    logo_url: 'https://truelayer-client-logos.s3-eu-west-1.amazonaws.com/banks/natwest.svg',
    icon_url: 'https://truelayer-client-logos.s3-eu-west-1.amazonaws.com/banks/banks-icons/ob-natwest-icon.svg',
    display_name: 'Natwest',
    country: 'GB',
    release_stage: 'live',
    enabled: false
  },
  {
    provider_id: 'ob-monzo',
    logo_url: 'https://truelayer-client-logos.s3-eu-west-1.amazonaws.com/banks/oauth-monzo.svg',
    icon_url: 'https://truelayer-client-logos.s3-eu-west-1.amazonaws.com/banks/banks-icons/oauth-monzo-icon.svg',
    display_name: 'Monzo',
    country: 'GB',
    release_stage: 'live',
    enabled: false
  },
  {
    provider_id: 'ob-santander',
    logo_url: 'https://truelayer-client-logos.s3-eu-west-1.amazonaws.com/banks/santander.svg',
    icon_url: 'https://truelayer-client-logos.s3-eu-west-1.amazonaws.com/banks/banks-icons/ob-santander-icon.svg',
    display_name: 'Santander',
    country: 'GB',
    release_stage: 'live',
    enabled: false
  }
];

export default providers;
