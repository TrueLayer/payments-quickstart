import { AccountType, ReleaseChannel, SupportedCurrency } from 'models/payments/response';

/* eslint-disable camelcase */
export interface ProviderQuery {
  auth_flow_type: string;
  account_type: AccountType;
  currency: SupportedCurrency[];
  release_channel: ReleaseChannel[];
  client_id: string;
}
