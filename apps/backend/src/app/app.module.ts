import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    CommonModule,

    AccountsModule,
    AuthModule,
    GeneralModule,
    TransactionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
