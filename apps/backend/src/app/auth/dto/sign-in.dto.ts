import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    type: 'string',
    description: 'The users username',
    example: 'admin',
  })
  username!: string;

  @ApiProperty({
    type: 'string',
    description: 'The users password',
    example: 'password',
  })
  password!: string;
}
