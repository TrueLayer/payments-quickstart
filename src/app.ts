import express from 'express';
import error from 'middleware/errors';
import logger from 'middleware/logger';
import payments from 'routes/payments';
import health from 'routes/health';
import helpers from 'routes/helpers';

const app = express();

const routes = [payments, health, helpers];

const middleware = [express.json(), logger.server.info, logger.server.error];

[...middleware, error, ...routes].forEach(register => app.use(register));

export default app;
