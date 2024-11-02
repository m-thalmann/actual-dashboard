import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

class AuthServiceTestClass extends AuthService {
  getUsers(): typeof this.users {
    return this.users;
  }
}

const mockUsers = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
];

const mockConfigUserString = mockUsers.map((user) => `${user.username}:${user.password}`).join(',');

describe('AuthService', () => {
  let service: AuthServiceTestClass;

  let mockConfigService: Partial<ConfigService>;
  let mockJwtService: Partial<JwtService>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn().mockImplementation((path) => (path === 'APP_USERS' ? mockConfigUserString : undefined)),
    };

    mockJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthServiceTestClass,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthServiceTestClass>(AuthServiceTestClass);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should load users from config', () => {
    const result = service.getUsers();

    expect(result).toEqual(mockUsers);
    expect(mockConfigService.get).toHaveBeenCalledWith('APP_USERS');
  });

  describe('signIn', () => {
    it('should return a token when user is found', async () => {
      const user = mockUsers[0];

      const expectedToken = 'my-jwt-token';

      (mockJwtService.signAsync as jest.Mock).mockResolvedValue(expectedToken);

      const result = await service.signIn(user.username, user.password);

      expect(result).toEqual(expectedToken);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ sub: user.username });
    });

    it('should throw an UnauthorizedException when user is not found', async () => {
      const user = { username: 'unknown', password: 'unknown' };

      await expect(service.signIn(user.username, user.password)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateToken', () => {
    it('should return the username when token is valid', async () => {
      const user = mockUsers[0];

      const token = 'my-jwt-token';

      (mockJwtService.verifyAsync as jest.Mock).mockResolvedValue({ sub: user.username });

      const result = await service.validateToken(token);

      expect(result).toEqual(user.username);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token);
    });

    it('should throw an UnauthorizedException when token is invalid', async () => {
      const token = 'invalid';

      (mockJwtService.verifyAsync as jest.Mock).mockRejectedValue(new Error());

      await expect(service.validateToken(token)).rejects.toThrow(UnauthorizedException);
    });
  });
});
