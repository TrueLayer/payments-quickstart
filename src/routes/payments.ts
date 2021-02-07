import { Router } from 'express';
import { createPayment } from 'controllers/payments';

const router = Router();

router.post('/payment/create', createPayment);

export default router;
