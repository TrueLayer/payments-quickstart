import axios from 'axios';
import Cache from 'node-cache';
import { AuthenticationResponse } from 'models/authentication';
import logger from 'middleware/logger';
import config from 'config';
import { HttpException } from 'middleware/errors';

/**
 *  It can authenticate the user given a clientId and a clientSecret
 */
export default class AuthenticationClient {
  private cache = new Cache();

  private client = logger.client(
    'authentication',
    axios.create({
      timeout: config.HTTP_CLIENT_TIMEOUT,
      baseURL: config.AUTH_URI,
      headers: { 'content-type': 'application/json' }
    })
  );

  private parseResponse = (data: any) => {
    const token = data?.access_token;

    if (!token) {
      this.invalidateCache();
      throw new Error('Failed parsing authentication request.');
    }

    this.cache.set(config.CLIENT_ID, token, data.expires_in);
    return this.toBearerToken(token);
  };

  private toBearerToken = (token: string) => `Bearer ${token}`;

  invalidateCache = () => this.cache.flushAll();

  /**
   * Main function that authenticate the user against the TrueLayer authentication endpoint.
   *
   * returns: an auth token following what specified [here](https://docs.truelayer.com/#payments-api)
   */
  authenticate = async () => {
    const token = this.cache.get<string>(config.CLIENT_ID);
    if (token) return this.toBearerToken(token);

    try {
      const { data } = await this.client.post<AuthenticationResponse>('/connect/token', {
        grant_type: 'client_credentials',
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        scope: 'payments'
      });

      return this.parseResponse(data);
    } catch (e) {
      throw HttpException.fromAxiosError(e, 'error');
    }
  };
}
