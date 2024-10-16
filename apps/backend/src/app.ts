import cors from 'cors';
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import routes from './routes/routes';
import { ActualConfig } from './services/actual.models';
import { ActualService } from './services/actual.service';
import { DI } from './services/di.service';

const DEFAULT_PORT = 3000;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const app: Express = express();

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());

const port = process.env.PORT || DEFAULT_PORT;

const actualConfig: ActualConfig = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  serverUrl: process.env.ACTUAL_SERVER_URL!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  password: process.env.ACTUAL_SERVER_PASSWORD!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  syncId: process.env.ACTUAL_SERVER_SYNC_ID!,
  filePassword: process.env.ACTUAL_SERVER_FILE_PASSWORD,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  dataDir: path.resolve(__dirname, '../data'),
  allowedAccounts: [],
};

const configAllowedAccounts = process.env.ACTUAL_SERVER_ALLOWED_ACCOUNTS;

if (configAllowedAccounts === '*' || configAllowedAccounts === undefined) {
  actualConfig.allowedAccounts = null;
} else {
  actualConfig.allowedAccounts = configAllowedAccounts.split(',');
}

const actualService = new ActualService(actualConfig);

DI.bind(ActualService, actualService);

app.use(routes);

app.use((error: Error, req: Request, res: Response) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  res.json(error.message);
});

(async () => {
  // TODO: handle when remote budget cant be loaded
  await actualService.init();

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`🎇 Server is running on http://localhost:${port}`);
  });
  // TODO: destroy actual service when shutting down
})();
