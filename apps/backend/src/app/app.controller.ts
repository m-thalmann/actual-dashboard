import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from './common/util/auth.utils';

@Controller('/')
@ApiExcludeController()
export class AppController {
  @Get()
  @Public()
  @Redirect('app')
  redirectToApp(): void {
    // redirect
  }
}
