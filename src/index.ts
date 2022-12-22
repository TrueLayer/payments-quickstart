import config from 'config';
import app from 'app';
import { exit } from 'process';

const clientId = config.CLIENT_ID;
const clientSecret = config.CLIENT_SECRET;
const kid = config.KID;
const privateKey = config.PRIVATE_KEY;

if (!clientId || !clientSecret || !kid || !privateKey) {
  console.error(
    "'CLIENT_ID', 'CLIENT_SECRET' and 'KID' and 'PRIVATE_KEY' environment variables are required to run the server"
  );
  exit();
}

app.listen(config.PORT, () => console.info(`⚡[server]: listening on port ${config.PORT}...`));
