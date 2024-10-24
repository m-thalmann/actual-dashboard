import { Request, Response, Router } from 'express';
import { ActualService } from '../../services/actual.service';
import { DI } from '../../services/di.service';
import { buildFilterParams } from '../../shared/filter.utils';
import { buildPaginationMeta, buildPaginationParams } from '../../shared/pagination.utils';

const router = Router();

router.get('/accounts/:accountId/transactions', async (req: Request, res: Response) => {
  const actualService = DI.get(ActualService);

  const accountId = req.params.accountId;

  const paginationParams = buildPaginationParams(req);
  const filterParams = buildFilterParams(req, [['category', 'category.name'], 'notes', 'date']);

  const { transactions, totalAmount } = await actualService.getTransactions(accountId, {
    pagination: paginationParams,
    filters: filterParams,
  });

  res.json({
    data: transactions,
    meta: buildPaginationMeta(paginationParams, totalAmount),
  });
});

export default router;
