import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('/')
@ApiExcludeController()
export class AppController {
  @Get()
  getMessage(): { message: string } {
    return { message: 'Unofficial Actual Rest API' };
  }
}
