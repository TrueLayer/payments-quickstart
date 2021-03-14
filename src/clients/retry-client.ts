import { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

interface RetryClientOptions {
  retries: number | undefined;
  isRetryableResponse?: (response: AxiosResponse) => boolean;
  isRetryableError?: (error: AxiosError) => boolean;
  retry: (request: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
}

export default class RetryClient {
  private retries: number;
  private isRetryableResponse?: (response: AxiosResponse) => boolean;
  private isRetryableError?: (error: AxiosError) => boolean;
  private retryRequest: (request: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;

  constructor(options: RetryClientOptions) {
    this.retries = options.retries || 3;
    this.retryRequest = options.retry;
    this.isRetryableResponse = options.isRetryableResponse;
    this.isRetryableError = options.isRetryableError;
  }

  attach = (client: AxiosInstance) => {
    // Using a closure allowing multiple clients to have the same base config.
    let attempts = 1;

    const handleAttempts = async <T>(condition: Boolean, request: AxiosRequestConfig, response: () => T) => {
      if (attempts < this.retries && condition) {
        attempts++;
        return client.request(await this.retryRequest(request));
      }
      attempts = 1;
      return response();
    };

    client.interceptors.response.use(
      // Intercept any request with a status code within the range of 2xx.
      async (response: AxiosResponse) => {
        const condition = this.isRetryableResponse?.(response) || false;
        return handleAttempts(condition, response.request, () => response);
      },
      // Intercept any request with a status code outside of the range of 2xx.
      async (error: AxiosError) => {
        const condition = this.isRetryableError?.(error) || false;
        return handleAttempts(condition, error.config, () => Promise.reject(error));
      }
    );

    return client;
  };
}
