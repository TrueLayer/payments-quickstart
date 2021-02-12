import { Router } from 'express';
import HelpersController from 'controllers/helpers';

const router = Router();
const { convertSvgToPng } = new HelpersController();

router.get('/helpers/convert', convertSvgToPng);

export default router;
