import { Router } from 'express';
import PaymentsController from 'controllers/payments';

const router = Router();
const { createPayment, getPayment, getProviders } = new PaymentsController();

router.post('/payment', createPayment);
router.get('/payment/:id', getPayment);
router.get('/providers', getProviders);

export default router;
