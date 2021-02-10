import { Router } from 'express';
import PaymentsController from 'controllers/payments';

const router = Router();
const {
  createPayment,
  getPayment
} = new PaymentsController();

router.post('/payment', createPayment);
router.get('/payment/:id', getPayment);

export default router;
