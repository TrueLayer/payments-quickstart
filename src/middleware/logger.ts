import winston from 'winston';
import expressWinston from 'express-winston';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const server = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  skip: () => process.env.NODE_ENV === 'test'
});

const client = (tag: string, client: AxiosInstance) => {
  if (process.env.NODE_ENV === 'test') {
    return client;
  }

  client.interceptors.request.use((request: AxiosRequestConfig) => {
    console.info(`[${tag}-client]: ➡`, request.method, `${request.baseURL}${request.url}`);
    return request;
  });

  client.interceptors.response.use((response: AxiosResponse) => {
    console.info(`[${tag}-client]: ⬅️`, response.status, response.statusText || '');
    return response;
  });

  return client;
};

export default {
  server,
  client
};
