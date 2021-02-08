import axios, { AxiosInstance } from 'axios';
import Cache from 'node-cache';
import { AuthenticationResponse } from 'models/authentication';
import logger from 'middleware/logger';
import config from 'config';
import RetryClient from './retry-client';

export default class AuthenticationClient {
    private client = logger.client('authentication', axios.create({
      timeout: 3000,
      baseURL: 'https://auth.t7r.dev/',
      headers: { 'content-type': 'application/json' }
    }));

    private cache = new Cache();

    authenticate = async () => {
      const token = this.cache.get(config.CLIENT_ID);
      if (token) return token;

      try {
        const { data } = await this.client.post<AuthenticationResponse>('connect/token', {
          grant_type: 'client_credentials',
          client_id: config.CLIENT_ID,
          client_secret: config.CLIENT_SECRET,
          scope: 'payments'
        });

        const accessToken = data.access_token;
        // TODO: parse token and grab expiry rather than assuming expiry is 3600. could change.
        this.cache.set(config.CLIENT_ID, accessToken, 3600);

        if (!accessToken) throw new Error('Missing `access_token`.');

        return `Bearer ${accessToken}`;
      } catch (e) {
        console.error(`Failed requesting access_token. ${e}`);
      }
    }

    // attach a retry policy for any UNAUTHORIZED requests to a client.
    attachAuthenticationRetry = (client: AxiosInstance) => {
      return new RetryClient({
        retries: 3,
        retry: async request => {
          this.cache.flushAll();
          request.headers.Authorization = await this.authenticate();
          return request;
        },
        errorCondition: error => error.response?.status === 401
      }).attach(client);
    };
}
