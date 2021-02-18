/* eslint-disable camelcase */

import nock, { Interceptor } from 'nock';
import AuthenticationClient from 'clients/authentication-client';
import { HttpException } from 'middleware/errors';
import config from 'config';

let authenticationClient: AuthenticationClient;
let authServerMock: Interceptor;

beforeEach(() => {
  authenticationClient = new AuthenticationClient();
  authServerMock = nock(config.AUTH_URI, {
    reqheaders: { 'content-type': 'application/json' }
  }).post('/connect/token');
});

describe('`authentication-client`', () => {
  it('Response from auth server is parsed correctly.', async () => {
    // Arrange
    const access_token = 'access_token';

    const scope = authServerMock.times(1).reply(200, { access_token, expires_in: 3600, token_type: 'bearer' });

    // Act
    const bearerToken = await authenticationClient.authenticate();

    // Assert
    expect(bearerToken).toBe(`Bearer ${access_token}`);
    // Assert the count of request calls.
    scope.done();
  });

  it('`access_token` is cached.', async () => {
    // Arrange
    const access_token = 'access_token';

    const scope = authServerMock.times(1).reply(200, { access_token, expires_in: 3600, token_type: 'bearer' });

    // Act
    const firstResponse = await authenticationClient.authenticate();
    const secondResponse = await authenticationClient.authenticate();

    // Assert
    expect(firstResponse).toEqual(secondResponse);
    expect(firstResponse).toEqual(`Bearer ${access_token}`);
    // Assert the count of request calls.
    scope.done();
  });

  it('response with invalid  `access_token` throws an error.', async () => {
    // Arrange
    const scope = authServerMock.times(1).reply(200, { access_token: '', expires_in: 3600, token_type: 'bearer' });

    // Act & Assert
    await expect(authenticationClient.authenticate()).rejects.toThrowError(
      new HttpException(500, 'Failed parsing authentication request.')
    );
    scope.done();
  });

  it('auth server request fails throws an error.', async () => {
    // Arrange
    const scope = authServerMock.reply(500);

    // Act & Assert
    await expect(authenticationClient.authenticate()).rejects.toThrow('Request failed with status code 500');
    scope.done();
  });
});
