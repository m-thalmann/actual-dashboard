import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import swaggerUi from 'swagger-ui-express';
import accountsController from './accounts/accounts.controller';
import generalController from './general/general.controller';
import transactionsController from './transactions/transactions.controller';

const api = Router()
  // base route
  .get('/', (req: Request, res: Response) => {
    res.json({ message: 'Unofficial Actual Rest API' });
  })
  .get('/docs/openapi.schema.json', (req: Request, res: Response) =>
    res.sendFile('openapi.schema.json', { root: './docs' }),
  )
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  .use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerOptions: { url: '/docs/openapi.schema.json' } }))
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
