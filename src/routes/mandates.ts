import { Router } from 'express';

import MandatesV3Controller from 'controllers/mandatesV3';

const router = Router();
const v3Controller = new MandatesV3Controller();

router.post('/v3/mandate', v3Controller.createMandate);
router.get('/v3/mandate/:id', v3Controller.getMandate);

export default router;
