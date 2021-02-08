import { Router } from 'express';
import PaymentsController from 'controllers/payments';

const router = Router();
const controller = new PaymentsController();

router.post('/payment', controller.createPayment);
router.get('/payment/:id', controller.getPayment);

export default router;
