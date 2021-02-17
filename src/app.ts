import express from 'express';
import error from 'middleware/errors';
import logger from 'middleware/logger';
import payments from 'routes/payments';
import health from 'routes/health';

const app = express();

const routes = [payments, health];

const middleware = [express.json(), logger.server];

[...middleware, ...routes, error].forEach(register => app.use(register));

export default app;
