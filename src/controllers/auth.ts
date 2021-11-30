import AuthenticationClient from '../clients/authentication-client';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../middleware/errors';

export default class AuthController {
  private authClient = new AuthenticationClient();

  getAuthToken = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const token = await this.authClient.authenticate();
      const responseBody = { auth_token: token };
      res.status(200).send(responseBody);
    } catch (e) {
      next(e instanceof HttpException ? e : new HttpException(500, 'Failed to retrieve the token.'));
    }
  };
}
