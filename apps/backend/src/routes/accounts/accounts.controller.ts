import { Request, Response, Router } from 'express';
import { ActualService } from '../../services/actual.service';
import { DI } from '../../services/di.service';

const router = Router();

router.get('/accounts', async (req: Request, res: Response) => {
  const actualService = DI.get(ActualService);

  const accounts = await actualService.getAccounts();

  res.json(accounts);
});

router.get('/accounts/:accountId/balance', async (req: Request, res: Response) => {
  const actualService = DI.get(ActualService);

  const accountId = req.params.accountId;

  const balance = await actualService.getAccountBalance(accountId);

  res.json(balance);
});

export default router;
