import { Request, Response } from 'express';
import { authenticate, initiatePayment } from 'middleware/client';

export const createPayment = async (req: Request, res: Response) => {
    try {
        const accessToken = await authenticate();
        const response = await initiatePayment(req.body, accessToken);
        res.status(200).send(response)
    } catch (e) {
        console.error('[server]: ', e);

        res.status(500).json({
            error: "Failed to initiate payments."
        })
    }
}

