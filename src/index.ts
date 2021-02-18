import config from 'config';
import app from 'app';
import { exit } from 'process';

const clientId = config.CLIENT_ID;
const clientSecret = config.CLIENT_SECRET;
const redirectUri = config.REDIRECT_URI;

if (!clientId || !clientSecret || !redirectUri) {
  console.error("'CLIENT_ID', 'CLIENT_SECRET' and 'REDIRECT_URI' environment variables are required to run the server");
  exit();
}

app.listen(config.PORT, () => console.info(`⚡[server]: listening on port ${config.PORT}...`));
