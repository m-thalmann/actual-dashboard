import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

interface User {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  protected readonly users: ReadonlyArray<User>;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    const configUsersString = this.configService.get<string>('APP_USERS') ?? '';
    const configUsers = configUsersString.split(',').filter((user) => user.length > 0);

    if (configUsers.length === 0) {
      throw new Error('No users found in config. Please provide at least one user.');
    }

    this.users = configUsers.map((user) => {
      const [username, password] = user.split(':');
      return { username, password };
    });
  }

  async signIn(username: string, password: string): Promise<string> {
    const user = this.users.find((u) => u.username === username && u.password === password);

    if (user === undefined) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.username };

    return await this.jwtService.signAsync(payload);
  }

  async validateToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);

      return payload.sub;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
