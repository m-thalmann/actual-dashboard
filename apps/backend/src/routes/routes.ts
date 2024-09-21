import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import accountsController from './accounts/accounts.controller';
import generalController from './general/general.controller';
import transactionsController from './transactions/transactions.controller';

const api = Router()
  // base route
  .get('/', (req: Request, res: Response) => {
    res.json({ message: 'Unofficial Actual Rest API' });
  })
  .use(accountsController)
  .use(transactionsController)
  .use(generalController);

export default Router()
  .use(process.env.BASE_PATH ?? '/', api)
  // 404 fallback route
  .use((req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND);
    res.json({ message: 'Route not found' });
  });
