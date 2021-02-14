/* eslint-disable camelcase */

// Sample app currently only uses `redirect` auth_flow.
export interface AuthFlowRedirect {
  type: 'redirect';
  return_uri: string;
  expiry?: Date;
  psu_ip_address?: string;
  data_access_token?: string;
}
