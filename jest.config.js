// Environment variables required for tests
process.env.PRIVATE_KEY =
  '-----BEGIN EC PRIVATE KEY-----\n' +
  'MIHcAgEBBEIAVItA/A9H8WA0rOmDO5kq774be6noZ73xWJkbmzihkhtnYJ+eCQl4\n' +
  'G68ZFKildLuR2DElMBrNgJHY1TkL9hr7U9GgBwYFK4EEACOhgYkDgYYABAFUhWeC\n' +
  'FTMeYIRncc2MOZpkwntTBl9q/ZJhwS1sNBzi4+GITBahhkzHOC+zPW9UaS6x9MiN\n' +
  'xd4J8Nn7G72CtFi3iQGjf3PDSLSPWtq7hPsGL62Fz9VmkLK7C3reZlZxGzk+VDOk\n' +
  'vfhsFJcvkvob1dS1efylfBQYyE0OnnFUZuyVGpNTyw==\n' +
  '-----END EC PRIVATE KEY-----\n';
process.env.KID = '45fc75cf-5649-4134-84b3-192c2c78e990';

process.env.BENEFICIARY_NAME = 'beneficiary';
process.env.SORT_CODE = '123456';
process.env.ACCOUNT_NUMBER = '12345678';
process.env.BENEFICIARY_IBAN = 'GB29BARC20039593936986';
process.env.PROVIDER_ID_PRESELECTED = 'mock-payments-gb-redirect';
process.env.TRUELAYER_CLIENT_ID = 'sandbox-test-12345';

module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleDirectories: ['node_modules', 'src']
};
