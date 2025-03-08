import { ApiProperty } from '@nestjs/swagger';

export class BalanceHistoryEntry {
  @ApiProperty({ type: 'string', format: 'date', description: 'Date of the balance', example: '2021-12-25' })
  date!: string;
  @ApiProperty({ type: 'number', description: 'Balance on date', example: 12345 })
  balance!: number;
}
