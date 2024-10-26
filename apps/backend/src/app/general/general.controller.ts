import { Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActualService } from '../common/actual/actual.service';

@Controller('general')
@ApiTags('General')
export class GeneralController {
  constructor(private readonly actualService: ActualService) {}

  @Post('reload')
  @ApiOperation({ summary: 'Reloads the Actual database' })
  @ApiOkResponse()
  async reload(): Promise<void> {
    await this.actualService.reload();
  }
}
