import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ActualService } from '../../services/actual.service';
import { DI } from '../../services/di.service';

const router = Router();

router.get('/accounts', async (req: Request, res: Response) => {
  const actualService = DI.get(ActualService);

  const accounts = await actualService.getAccounts();

  res.json(accounts);
});

router.get('/accounts/:accountId', async (req: Request, res: Response) => {
  const actualService = DI.get(ActualService);

  const accountId = req.params.accountId;

  const details = await actualService.getAccountDetails(accountId);

  if (details === null) {
    res.status(StatusCodes.NOT_FOUND).send();
    return;
  }

  res.json(details);
});

export default router;
