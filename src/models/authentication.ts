/* eslint-disable camelcase */

export interface AuthenticationRequest {
  grant_type: string;
  client_id: string;
  client_secret: string;
  scope: string;
}

export interface AuthenticationResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}