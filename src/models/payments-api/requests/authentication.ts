/* eslint-disable camelcase */

export interface AuthenticationRequest {
  grant_type: string;
  client_id: string;
  client_secret: string;
  scope: string;
}
