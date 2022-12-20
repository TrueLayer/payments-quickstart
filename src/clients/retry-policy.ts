import { AxiosRequestConfig, AxiosResponse } from 'axios';
import AuthenticationClient from './authentication-client';
import { RetryPolicy } from './retry-client-factory';

// Build a retry policy for any UNAUTHORIZED responses that are dependant on `AuthenticationClient`.
export const initRetryPolicy = (authenticationClient: AuthenticationClient): RetryPolicy => ({
  retries: 3,
  isRetryable: response => response.status === 401,
  retryRequest: async (request: AxiosRequestConfig, response: AxiosResponse) => {
    if (response.status === 401) {
      authenticationClient.invalidateCache();
      request.headers.authorization = await authenticationClient.authenticate();
    }
    return request;
  }
});

export default initRetryPolicy;
