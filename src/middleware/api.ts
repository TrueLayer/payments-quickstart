import { client } from "./common";

const paymentBaseUrl = "https://pay-api.t7r.dev/v2/"

export const initiatePayment = async (req: PaymentRequest, token: string) => {
  try {
    let response = await client.post(`${paymentBaseUrl}single-immediate-payment-initiation-requests`, req, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    return error.response.data
  }

}