import PaymentsV3Controller from 'controllers/paymentsV3';
import { PaymentsV3NeoController } from 'controllers/paymentsV3Neo';
import { Router } from 'express';

const router = Router();
const v3Controller = new PaymentsV3Controller();
const v3ControllerNeo = new PaymentsV3NeoController();

router.post('/v3/payment', v3Controller.createPayment);
router.post('/v3/payment/euro', v3Controller.createEuroPayment);
router.post('/v3/payment/provider', v3Controller.createPaymentWithProvider());
router.get('/v3/payment/:id', v3Controller.getPayment);
router.post('/v3/payment/create', v3ControllerNeo.createPayment);

export default router;
