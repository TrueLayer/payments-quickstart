/* eslint-disable camelcase */

// Sample app currently only uses `redirect` auth_flow.
export interface AuthFlowRedirectRequest {
  type: 'redirect';
  return_uri: string;
  psu_ip_address?: string;
  data_access_token?: string;
}

export interface AuthFlowRedirectResponse {
  type: 'redirect';
  uri: string;
  expiry?: Date;
}
