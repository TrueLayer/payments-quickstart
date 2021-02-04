import express, { Request, Response } from 'express'
import axios from 'axios'
import winston from "winston";
import expressWinston from 'express-winston'
import config from './config'
import { AuthRequest, AuthResponse } from './models/authentication'
import { client } from "./middleware/common";
import { initiatePayment } from "./middleware/api";

const app = express()

app.use(express.json())

const router = express.Router();

//Logger
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
  )
}));

app.use(router);

//ErrorLogger
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
  )
}));

router.get('/error', function (req, res, next) {
  // here we cause an error in the pipeline so we see express-winston in action.
  return next(new Error("This is an error and it should be logged to the console"));
});

router.post('/payment', async (req: Request, res: Response) => {
  const access_token = await client.post<AuthResponse>(`https://auth.t7r.dev/connect/token`, {
    "grant_type": "client_credentials",
    "client_id": config.CLIENT_ID,
    "client_secret": config.CLIENT_SECRET,
    "scope": "payments"
  })
      .then(res => res.data.access_token)
      .catch(e => {
        res.send(e)
        console.error(`Failed requesting access_token. ${e}`)
      })
  if (access_token) {
    try {
      const response = await initiatePayment(req.body, access_token)
      console.log(response)
      res.send(response)
    } catch (error) {
      console.log(error)
    }
  } else {
    res.status(500)
    res.send({error: "Failed to initiate payments."})
  }

})

router.get('/ping', (req: Request, res: Response) => res.status(200))

app.listen(config.PORT, () => console.log(`Server listening on port ${config.PORT}...`))
