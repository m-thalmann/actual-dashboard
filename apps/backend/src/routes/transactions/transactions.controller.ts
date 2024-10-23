import { Request, Response, Router } from 'express';
import { ActualService } from '../../services/actual.service';
import { DI } from '../../services/di.service';
import { buildPaginationMeta, buildPaginationParams } from '../../shared/pagination.utils';

const router = Router();

router.get('/accounts/:accountId/transactions', async (req: Request, res: Response) => {
  const actualService = DI.get(ActualService);

  const accountId = req.params.accountId;

  const paginationParams = buildPaginationParams(req);

  const [transactions, totalAmount] = await Promise.all([
    actualService.getTransactions(accountId, paginationParams),
    actualService.getTransactionsCount(accountId),
  ]);

  res.json({
    data: transactions,
    meta: buildPaginationMeta(paginationParams, totalAmount),
  });
});

export default router;
