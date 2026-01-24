
import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                id?: string;
                role: string;
                [key: string]: any;
            };
        }
    }
}
