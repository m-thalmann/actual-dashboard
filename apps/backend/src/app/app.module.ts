import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

import { AccountsModule } from './accounts/accounts.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { GeneralModule } from './general/general.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: path.resolve(__dirname, '.env') }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'client'),
      serveRoot: '/app',
    }),
    CommonModule,

    AccountsModule,
    AuthModule,
    GeneralModule,
    TransactionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
