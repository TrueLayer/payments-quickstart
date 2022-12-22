import AuthController from '../controllers/auth';
import { Router } from 'express';

const router = Router();
const authController = new AuthController();

router.get('/auth/get-auth-token', authController.getAuthToken);

export default router;
