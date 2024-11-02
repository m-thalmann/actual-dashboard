import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActualService } from '../common/actual/actual.service';

@Controller('general')
@ApiTags('General')
@ApiBearerAuth()
export class GeneralController {
  constructor(private readonly actualService: ActualService) {}

  @Post('reload')
  @ApiOperation({ summary: 'Reloads the Actual database' })
  @ApiOkResponse()
  async reload(): Promise<void> {
    await this.actualService.reload();
  }
}
