import { ApiProperty } from '@nestjs/swagger';

export class CashFlowEntry {
  @ApiProperty({ type: 'string', format: 'date', description: 'Transaction date', example: '2021-12-25' })
  date!: string;
  @ApiProperty({ type: 'number', description: 'Deposit amount on date', example: 12345 })
  deposit!: number;
  @ApiProperty({ type: 'number', description: 'Payment amount on date', example: 12345 })
  payment!: number;
}
