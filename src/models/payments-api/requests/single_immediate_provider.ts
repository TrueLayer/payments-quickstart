import { AccountType, ReleaseChannel, SupportedCurrency } from 'models/payments-api/common';
/* eslint-disable camelcase */

export interface SingleImmediateProviderRequest {
  auth_flow_type: string;
  account_type: AccountType;
  currency: SupportedCurrency[];
  release_channel: ReleaseChannel[];
  client_id: string;
}

export default SingleImmediateProviderRequest;
