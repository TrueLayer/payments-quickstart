import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { AuthResponse } from 'models/authentication'
import config from 'config'

const client = axios.create({
    timeout: 3000,
    headers: { "content-type": "application/json" },
})

export const authenticate = async () => { 
  try {
    const response = await client.post<AuthResponse>(`https://auth.t7r.dev/connect/token`, {
      "grant_type": "client_credentials",
      "client_id": config.CLIENT_ID,
      "client_secret": config.CLIENT_SECRET,
      "scope": "payments"
    });

    const accessToken = response.data["access_token"];
    
    if(!accessToken) throw 'Missing `access_token`.'
    
    return accessToken

  } catch (e) {
    console.error(`Failed requesting access_token. ${e}`)
  }
}

client.interceptors.request.use((request: AxiosRequestConfig) => {
    console.info('[client]: ➡️', request.method, request.url);
    return request;
})

client.interceptors.response.use((response: AxiosResponse) => {
    console.info('[client]: ⬅️', response.statusText);
    return response; 
})

export default client;