import { Global, Module } from '@nestjs/common';
import { ActualService } from './actual/actual.service';

@Global()
@Module({
  providers: [ActualService],
  exports: [ActualService],
})
export class CommonModule {}
