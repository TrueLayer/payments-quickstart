import config from 'config';
import app from 'app';

app.listen(config.PORT, () => console.info(`⚡[server]: listening on port ${config.PORT}...`));
