export default {
  SORT_CODE: process.env.SORT_CODE || '123456',
  ACCOUNT_NUMBER: process.env.ACCOUNT_NUMBER || '12345678',
  WEBHOOK_URI: process.env.WEB_HOOK_URI || '',
  REDIRECT_URI: process.env.REDIRECT_URI || '',
  BENEFICIARY_NAME: process.env.BENEFICIARY_NAME || 'beneficiary',
  CLIENT_ID: process.env.TRUELAYER_CLIENT_ID || '',
  CLIENT_SECRET: process.env.TRUELAYER_CLIENT_SECRET || '',
  HTTP_CLIENT_TIMEOUT: 10000,
  AUTH_URI: process.env.AUTH_URI || 'https://auth.truelayer-sandbox.com',
  PAYMENTS_URI: process.env.PAYMENTS_URI || 'https://pay-api.truelayer-sandbox.com/v2',
  PORT: process.env.PORT || 3000
};
