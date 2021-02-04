import client from "middleware/client";

const paymentBaseUrl = "https://pay-api.t7r.dev/v2/"

export const initiatePayment = async (request: PaymentRequest, token: string | undefined) => {
  if(!token) throw 'missing `access_token`.';
  
  const uri = `${paymentBaseUrl}single-immediate-payment-initiation-requests`;
  const headers = { headers: { "Authorization": `Bearer ${token}` } };

  try {
    const res = await client.post<PaymentResponse>(uri, request, headers);
    return res.data;
  } catch (err) {
    return err.response.data;
  }
}