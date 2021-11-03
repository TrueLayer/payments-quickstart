declare module 'truelayer-signing' {
  export function sign(args: {
    privateKeyPem: string;
    kid: string;
    method?: string;
    path: string;
    body?: string;
    headers?: any;
  }): string;
}
