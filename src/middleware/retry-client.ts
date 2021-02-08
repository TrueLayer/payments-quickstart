import { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

interface RetryClientOptions {
    retries: number | undefined,
    successCondition?: (response: AxiosResponse) => boolean,
    errorCondition?: (error: AxiosError) => boolean,
    retry: (request: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
}

const successDefault = (_: AxiosResponse) => false;
const errorDefault = (_: AxiosError) => false;

export default class RetryClient {
    private retries: number;
    private successCondition: (response: AxiosResponse) => boolean;
    private errorCondition: (error: AxiosError) => boolean;
    private retry: (request: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;

    constructor (options: RetryClientOptions) {
      this.retries = options.retries || 3;
      this.retry = options.retry;
      this.successCondition = options.successCondition || successDefault;
      this.errorCondition = options.errorCondition || errorDefault;
    }

    private shouldErrorRetry = (attempts: number, error: AxiosError) => {
      if (attempts < this.retries && this.errorCondition(error)) {
        return true;
      } else if (attempts >= this.retries) {
        return false;
      }

      return false;
    }

    private shouldSuccessRetry = (attempts: number, response: AxiosResponse) => {
      if (attempts < this.retries && this.successCondition(response)) {
        return true;
      } else if (attempts >= this.retries) {
        return false;
      }

      return false;
    }

    attach = (client: AxiosInstance) => {
      // Using a closure allowing multiple clients to have the same base config.
      let attempts = 0;

      client.interceptors.response.use(
        async (response: AxiosResponse) => {
          // Any status code within the range of 2xx.
          if (this.shouldSuccessRetry(attempts, response)) {
            attempts++;
            return client.request(await this.retry(response.request));
          }
          attempts = 0;

          return response;
        },
        async (error: AxiosError) => {
          // Any status code outside of the range of 2xx.

          if (this.shouldErrorRetry(attempts, error)) {
            attempts++;
            return client.request(await this.retry(error.request));
          }
          attempts = 0;

          return Promise.reject(error);
        }
      );

      return client;
    }
}
