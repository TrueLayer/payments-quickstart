import winston from 'winston';
import expressWinston from 'express-winston';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const server = {
  info: expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )
  }),

  error: expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )
  })
};

const client = (tag: string, client: AxiosInstance) => {
  client.interceptors.request.use((request: AxiosRequestConfig) => {
    console.info(`[${tag}-client]: ➡`, request.method, request.url, request.baseURL);
    return request;
  });

  client.interceptors.response.use((response: AxiosResponse) => {
    console.info(`[${tag}-client]: ⬅️`, response.statusText);
    return response;
  });

  return client;
};

export default {
  server,
  client
};
