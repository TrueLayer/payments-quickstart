import express from 'express';
import cors from 'cors';
import error from 'middleware/errors';
import logger from 'middleware/logger';
import payments from 'routes/payments';
import health from 'routes/health';
import auth from 'routes/auth';
import mandates from 'routes/mandates';

const app = express();

app.use(cors());

const routes = [auth, payments, mandates, health];

const middleware = [express.json(), logger.server];

[...middleware, ...routes, error].forEach(register => app.use(register));

export default app;
