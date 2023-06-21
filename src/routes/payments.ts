import PaymentsV3Controller from 'controllers/paymentsV3';
import { Router } from 'express';

const router = Router();
const v3Controller = new PaymentsV3Controller();

router.post('/v3/payment', v3Controller.createPayment);
router.post('/v3/payment/euro', v3Controller.createEuroPayment);
router.post('/v3/payment/provider', v3Controller.createPaymentWithProvider());
router.post('/v3/payment/scheme_selection', v3Controller.createPaymentWithUserSelectedScheme());
router.get('/v3/payment/:id', v3Controller.getPayment);

export default router;
