import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthResponse } from 'models/authentication';
import config from 'config';

const client = axios.create({
    timeout: 3000,
    headers: { "content-type": "application/json" },
});

export const initiatePayment = async (request: PaymentRequest, token: string | undefined) => {
    if(!token) throw 'missing `access_token`.';
    
    const baseUri = "https://pay-api.t7r.dev/v2/";
    const uri = `${baseUri}single-immediate-payment-initiation-requests`;
    const headers = { headers: { "Authorization": `Bearer ${token}` } };

    try {
        const res = await client.post<PaymentResponse>(uri, request, headers);
        return res.data;
    } catch (err) {
        return err.response.data;
    }
}

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


// Logging for client
client.interceptors.request.use((request: AxiosRequestConfig) => {
    console.info('[client]: ➡️', request.method, request.url);
    return request;
})

client.interceptors.response.use((response: AxiosResponse) => {
    console.info('[client]: ⬅️', response.statusText);
    return response; 
})

export default client;