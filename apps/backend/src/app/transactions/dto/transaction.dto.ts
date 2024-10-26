import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../../common/actual/actual.models';

export class TransactionDto implements Transaction {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'Unique identifier',
    example: 'ca83bf55-ac0a-4bcd-965e-ed6632d2ce7f',
  })
  id!: string;

  @ApiProperty({ type: 'string', format: 'date', description: 'Transaction date', example: '2021-12-25' })
  date!: string;

  @ApiProperty({ type: 'string', description: 'Transaction payee', example: 'John Doe' })
  payee!: string;

  @ApiProperty({
    type: 'string',
    description: 'Transaction description',
    example: 'Payment',
    nullable: true,
  })
  notes!: string | null;

  @ApiProperty({ type: 'string', description: 'Transaction category', example: 'Food', nullable: true })
  category!: string | null;

  @ApiProperty({ type: 'number', description: 'Transaction amount in cents', example: 12345 })
  amount!: number;
}
