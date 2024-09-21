import { Request, Response, Router } from 'express';
import { ActualService } from '../../services/actual.service';
import { DI } from '../../services/di.service';

const router = Router();

router.get('/general/reload', async (req: Request, res: Response) => {
  const actualService = DI.get(ActualService);

  await actualService.reload();

  res.json({ status: 'ok' });
});

export default router;
