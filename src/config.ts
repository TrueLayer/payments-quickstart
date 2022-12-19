import { decodeBase64 } from 'utils';

export default {
  SORT_CODE: process.env.SORT_CODE,
  ACCOUNT_NUMBER: process.env.ACCOUNT_NUMBER,
  WEBHOOK_URI: process.env.WEB_HOOK_URI,
  REDIRECT_URI: process.env.REDIRECT_URI,
  BENEFICIARY_NAME: process.env.BENEFICIARY_NAME,
  BENEFICIARY_IBAN: process.env.BENEFICIARY_IBAN,
  CLIENT_ID: process.env.TRUELAYER_CLIENT_ID,
  CLIENT_SECRET: process.env.TRUELAYER_CLIENT_SECRET,
  HTTP_CLIENT_TIMEOUT: process.env.HTTP_CLIENT_TIMEOUT ? +process.env.HTTP_CLIENT_TIMEOUT : 10000,
  AUTH_URI: process.env.AUTH_URI || 'https://auth.truelayer-sandbox.com',
  PAYMENTS_V3_URI: process.env.PAYMENTS_V3_URI || 'https://api.truelayer-sandbox.com',
  HPP_URI: process.env.HPP_URI || 'https://payment.truelayer-sandbox.com',
  PORT: process.env.PORT || 3000,
  KID: process.env.KID,
  PRIVATE_KEY: decodeBase64(process.env.BASE64_PRIVATE_KEY) || process.env.PRIVATE_KEY,
  PROVIDER_ID_PRESELECTED: process.env.PROVIDER_ID_PRESELECTED
};
