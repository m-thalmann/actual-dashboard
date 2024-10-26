import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class AppController {
  @Get()
  getMessage(): { message: string } {
    return { message: 'Unofficial Actual Rest API' };
  }
}
