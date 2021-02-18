import axios from 'axios';
import Cache from 'node-cache';
import { AuthenticationResponse } from 'models/authentication';
import logger from 'middleware/logger';
import config from 'config';

export default class AuthenticationClient {
  private client = logger.client(
    'authentication',
    axios.create({
      timeout: 10000,
      baseURL: 'https://auth.t7r.dev/',
      headers: { 'content-type': 'application/json' }
    })
  );

  private cache = new Cache();

  private toBearerToken = (token: string) => `Bearer ${token}`;

  invalidateCache = () => this.cache.flushAll();

  authenticate = async () => {
    const token = this.cache.get<string>(config.CLIENT_ID);
    if (token) return this.toBearerToken(token);

    try {
      const { data } = await this.client.post<AuthenticationResponse>('connect/token', {
        grant_type: 'client_credentials',
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        scope: 'payments'
      });

      const accessToken = data.access_token;
      this.cache.set(config.CLIENT_ID, accessToken, data.expires_in);

      if (!accessToken) throw new Error('Missing `access_token`.');

      return this.toBearerToken(accessToken);
    } catch (e) {
      throw new Error(`Failed requesting access_token. ${e}`);
    }
  };
}
