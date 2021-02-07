/* eslint-disable camelcase */

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface AuthRequest {
  grant_type: string;
  client_id: string;
  client_secret: string;
  scope: string;
}
