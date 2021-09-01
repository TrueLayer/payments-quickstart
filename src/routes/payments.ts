import { Router } from 'express';
import PaymentsV2Controller from 'controllers/paymentsV2';
import PaymentsV3Controller from 'controllers/paymentsV3';

const router = Router();
const v2Controller = new PaymentsV2Controller();
const v3Controller = new PaymentsV3Controller();

router.post('/payment', v2Controller.createPayment);
router.get('/payment/:id', v2Controller.getPayment);

router.post('/v3/payment', v3Controller.createPayment);
router.get('/v3/payment/:id', v3Controller.getPayment);

export default router;
