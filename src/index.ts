import express, { Request, Response } from 'express'
import axios from 'axios'
import config from './config'
import { AuthenticationResponse } from './models/authentication'

const app = express()

app.use(express.json())

const client = axios.create({
    timeout: 3000,
    headers: { "content-type": "application/json" },
})

app.post('/payment', async (req: Request, res: Response) => {
    const access_token = await client.post<AuthenticationResponse>(`https://auth.truelayer.com/connect/token/`, {
        data : {
            "grant_type": "client_credentials",
            "client_id": config.CLIENT_ID,
            "client_secret": config.CLIENT_SECRET,
            "scope": "payments" 
        }
    })
    .then(res => res.data["access_token"])
    .catch(e => console.error(`Failed requesting access_token. ${e}`))
    
})

app.get('/ping', (req: Request, res: Response) => res.status(200))

app.listen(config.PORT, () => console.log(`Server listening on port ${config.PORT}...`))
