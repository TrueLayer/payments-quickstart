import { Router, Response, Request } from 'express';

const router = Router();

router.get('/error', function (req, res, next) {
  // here we cause an error in the pipeline so we see express-winston in action.
  return next(new Error('This is an error and it should be logged to the console'));
});

router.get('/ping', (req: Request, res: Response) => res.status(200).send());

export default router;
