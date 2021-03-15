import { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

export interface RetryPolicy {
  retries: number | undefined;
  isRetryable: (response: AxiosResponse) => boolean;
  retryRequest?: (request: AxiosRequestConfig, response: AxiosResponse) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
}

export default class RetryClientFactory {
  private retries: number;
  private isRetryable: (response: AxiosResponse) => boolean;
  private retryRequest?: (request: AxiosRequestConfig, response: AxiosResponse) => AxiosRequestConfig | Promise<AxiosRequestConfig>;

  constructor(options: RetryPolicy) {
    this.retries = options.retries || 3;
    this.retryRequest = options.retryRequest;
    this.isRetryable = options.isRetryable;
  }

  attach = (client: AxiosInstance) => {
    // Using a closure allowing multiple clients to have the same base config.
    let attempts = 1;

    const handleAttempts = async <T>(response: AxiosResponse, request: AxiosRequestConfig, fallback: () => T) => {
      if (attempts < this.retries && this.isRetryable?.(response)) {
        attempts++;
        const mutatedRequest = await this.retryRequest?.(request, response);
        return client.request(mutatedRequest || request);
      }
      attempts = 1;
      return fallback();
    };

    client.interceptors.response.use(
      // Intercept any request with a status code within the range of 2xx.
      (response: AxiosResponse) => handleAttempts(response, response.request, () => response),
      // Intercept any request with a status code outside of the range of 2xx.
      (error: AxiosError) => {
        if (!error.response) return Promise.reject(error);
        return handleAttempts(error.response, error.config, () => Promise.reject(error));
      }
    );

    return client;
  };
}
