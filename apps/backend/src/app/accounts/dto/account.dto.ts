import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../../common/actual/actual.models';

export class AccountDto implements Account {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'The account ID',
    example: 'ca83bf55-ac0a-4bcd-965e-ed6632d2ce7f',
  })
  id!: string;

  @ApiProperty({ type: 'string', description: 'Account name', example: 'My Bank Account' })
  name!: string;

  @ApiProperty({ type: 'number', description: 'Account balance in cents', example: 12345 })
  amount!: number;
}
