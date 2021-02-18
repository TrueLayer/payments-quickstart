export default {
  SORT_CODE: process.env.SORT_CODE || '123456',
  ACCOUNT_NUMBER: process.env.ACCOUNT_NUMBER || '12345678',
  WEBHOOK_URI: process.env.WEB_HOOK_URI || null,
  REDIRECT_URI: process.env.REDIRECT_URI || '',
  BENEFICIARY_NAME: process.env.BENEFICIARY_NAME || 'beneficiary',
  CLIENT_ID: process.env.CLIENT_ID || '',
  CLIENT_SECRET: process.env.CLIENT_SECRET || '',
  PORT: process.env.PORT || 3000
};
