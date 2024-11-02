import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/util/auth.utils';
import { getResponseSchema } from '../common/util/swagger.utils';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({
    schema: getResponseSchema('string', { description: 'JWT token', example: 'token' }),
  })
  async signIn(@Body() signInDto: SignInDto): Promise<{ data: string }> {
    const token = await this.authService.signIn(signInDto.username, signInDto.password);

    return { data: token };
  }
}
