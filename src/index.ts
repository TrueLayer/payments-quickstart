import express, { Request, Response } from 'express';
import config from './config';
import logger from './middleware/logger';
import payments from './routes/payments';

const app = express()
app.use(express.json())

const router = express.Router();

// Attach middleware 
[router, logger.info, logger.error]
    .forEach(middleware => app.use(middleware));

// Attach routes
[payments]
    .forEach(route => app.use(route));


router.get('/error', function (req, res, next) {
    // here we cause an error in the pipeline so we see express-winston in action.
    return next(new Error("This is an error and it should be logged to the console"));
});

router.get('/ping', (req: Request, res: Response) => res.status(200).send())

app.listen(config.PORT, () => console.log(`[server]: listening on port ${config.PORT}.`))
