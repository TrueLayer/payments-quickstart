import express, { Request, Response } from 'express';
import config from 'config';
import { authenticate } from 'middleware/client';
import logger from 'middleware/logger';
import { initiatePayment } from 'middleware/api';

const app = express()
app.use(express.json())

const router = express.Router();

[router, logger.info, logger.error]
    .forEach(middleware => app.use(middleware))

router.post('/payment', async (req: Request, res: Response) => {
    try {
        const accessToken = await authenticate();
        const response = await initiatePayment(req.body, accessToken)
        res.status(200).send(response)
    } catch (e) {
        console.error('[server]: ', e);

        res.status(500).json({
            error: "Failed to initiate payments."
        })
    }
})

router.get('/error', function (req, res, next) {
    // here we cause an error in the pipeline so we see express-winston in action.
    return next(new Error("This is an error and it should be logged to the console"));
});

router.get('/ping', (req: Request, res: Response) => res.status(200).send())

app.listen(config.PORT, () => console.log(`[server]: listening on port ${config.PORT}.`))
