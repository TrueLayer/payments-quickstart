export default {
  SORT_CODE: process.env.SORT_CODE || '123456',
  ACCOUNT_NUMBER: process.env.ACCOUNT_NUMBER || '12345678',
  WEBHOOK_URI: process.env.WEB_HOOK_URI || '',
  REDIRECT_URI: process.env.REDIRECT_URI || '',
  CLIENT_ID: process.env.CLIENT_ID || '',
  CLIENT_SECRET: process.env.CLIENT_SECRET || '',
  PORT: process.env.PORT || 3000
};
