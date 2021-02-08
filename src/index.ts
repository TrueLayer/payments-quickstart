import express from 'express';
import config from 'config';
import error from 'middleware/errors';
import logger from 'middleware/logger';
import payments from 'routes/payments';
import health from 'routes/health';

const app = express();

const routes = [payments, health];

const middleware = [express.json(), logger.server.info, logger.server.error];

[...middleware, ...routes, error]
  .forEach(register => app.use(register));

app.listen(config.PORT, () => console.log(`[server]: listening on port ${config.PORT}.`));
