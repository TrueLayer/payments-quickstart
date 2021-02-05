import express, { Request, Response, ErrorRequestHandler } from 'express';
import config from 'config';
import error from 'middleware/errors'
import logger from 'middleware/logger';
import payments from 'routes/payments';
import health from 'routes/health';

const app = express()

const routes = [payments, health];
const middleware = [express.json(), logger.info, logger.error];

[...middleware, ...routes, error]
    .forEach(register => app.use(register));

app.listen(config.PORT, () => console.log(`[server]: listening on port ${config.PORT}.`))
