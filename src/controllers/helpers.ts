import sharp from 'sharp';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../middleware/errors';
import axios from 'axios';

export default class HelpersController {
  private client = axios.create({
    method: 'get',
    responseType: 'stream'
  });

  convertSvgToPng = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sharpStream = sharp({
        failOnError: false
      });

      res.type('png');

      const svgUrl = req.query.svg as string;
      if (!svgUrl) {
        next(new HttpException(400, 'Query parameter "url" is required.'));
      }

      const response = await this.client(svgUrl);
      response.data.pipe(sharpStream);
      await sharpStream.clone().resize({ width: 400 }).png().pipe(res);
    } catch (e) {
      console.log(e);
      next(new HttpException(500, 'Failed to convert assets.'));
    }
  };
}
