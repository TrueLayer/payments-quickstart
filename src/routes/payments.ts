import { Router } from 'express';
import PaymentsController from 'controllers/payments';
import AuthenticationClient from 'middleware/authentication-client';
import PaymentsClient from 'middleware/payment-client';

const router = Router();
const authenticationClient = new AuthenticationClient();
const paymentsClient = new PaymentsClient(authenticationClient);
const controller = new PaymentsController(paymentsClient);

router.post('/payment', controller.createPayment);
router.get('/payment/:id', controller.getPayment);

export default router;
