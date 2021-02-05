import { Request, Response, NextFunction } from 'express'

export class HttpException extends Error {
    public status: number;
    public message: string;

    constructor(status: number, message: string) {
        super(message)
        this.status = status
        this.message = message
    }
}

export default function error(error: HttpException, req: Request, res: Response, next: NextFunction) {
    res.status(error.status);
    res.json({ error: error.message }).send()
}