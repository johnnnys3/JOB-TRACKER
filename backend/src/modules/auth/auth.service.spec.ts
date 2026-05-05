import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  const usersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const jwtService = {
    sign: jest.fn(),
  };
  const configService = {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        BCRYPT_ROUNDS: '12',
        FRONTEND_URL: 'http://localhost:3000',
        NODE_ENV: 'test',
      };
      return values[key];
    }),
  };

  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(usersService as any, jwtService as any, configService as any);
  });

  it('rejects login when the user does not exist', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(authService.login({ email: 'missing@example.com', password: 'password1' }))
      .rejects
      .toBeInstanceOf(UnauthorizedException);
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('rejects login when the password is invalid', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      password: 'hashed-password',
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.login({ email: 'user@example.com', password: 'wrong-password' }))
      .rejects
      .toBeInstanceOf(UnauthorizedException);
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('signs a token from the persisted user after valid credentials', async () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const updatedAt = new Date('2026-01-02T00:00:00.000Z');
    usersService.findByEmail.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      password: 'hashed-password',
      firstName: 'Test',
      lastName: 'User',
      createdAt,
      updatedAt,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('signed-token');

    const result = await authService.login({ email: 'user@example.com', password: 'password1' });

    expect(jwtService.sign).toHaveBeenCalledWith({ email: 'user@example.com', sub: 'user-1' });
    expect(result).toEqual({
      access_token: 'signed-token',
      user: {
        id: 'user-1',
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt,
        updatedAt,
      },
    });
  });
});
