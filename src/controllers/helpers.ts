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
      const svgUrl = req.query.svg as string;
      if (!svgUrl) {
        next(new HttpException(400, 'Query parameter "url" is required.'));
      }
      await this.client(svgUrl)
        .then(res => res.data.pipe(sharpStream))
        .catch(() => {
          next(new HttpException(404, 'Asset not found.'));
        });
      res.type('png');
      await sharpStream.clone().png().pipe(res);
    } catch (e) {
      next(new HttpException(500, 'Failed to convert assets.'));
    }
  };
}
