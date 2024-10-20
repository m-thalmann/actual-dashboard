import { Request, Response, Router } from 'express';
import { ActualService } from '../../services/actual.service';
import { DI } from '../../services/di.service';

const DEFAULT_PAGE_SIZE = 20;

const router = Router();

router.get('/accounts/:accountId/transactions', async (req: Request, res: Response) => {
  const actualService = DI.get(ActualService);

  const accountId = req.params.accountId;

  const page = req.query.page === undefined ? 1 : parseInt(req.query.page as string, 10);
  const pageSize =
    req.query['page-size'] === undefined ? DEFAULT_PAGE_SIZE : parseInt(req.query['page-size'] as string, 10);

  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  const [transactions, totalAmount] = await Promise.all([
    actualService.getTransactions(accountId, limit, offset),
    actualService.getTransactionsCount(accountId),
  ]);

  const lastPage = Math.ceil(totalAmount / pageSize);

  res.json({ data: transactions, meta: { total: totalAmount, perPage: pageSize, currentPage: page, lastPage } });
});

export default router;
