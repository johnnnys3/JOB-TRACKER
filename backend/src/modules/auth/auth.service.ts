import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

type AuthenticatedUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createAuthResponse(user);
  }

  async refresh(user: AuthenticatedUser) {
    return this.createAuthResponse(user);
  }

  private createAuthResponse(user: AuthenticatedUser) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async register(userData: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(userData.email);

    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, this.getBcryptRounds());
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
    
    const { password, ...result } = user;
    return this.createAuthResponse(result);
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return {
        resetLinkSent: true,
      };
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashResetToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.usersService.setPasswordResetToken(user.id, tokenHash, expiresAt);

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
    await this.sendPasswordResetEmail(user.email, resetUrl);

    return {
      resetLinkSent: true,
    };
  }

  async resetPassword({ token, password }: ResetPasswordDto) {
    const tokenHash = this.hashResetToken(token);
    const user = await this.usersService.findByPasswordResetTokenHash(tokenHash);

    if (!user) {
      throw new BadRequestException('Password reset link is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(password, this.getBcryptRounds());
    await this.usersService.updatePassword(user.id, hashedPassword);

    return {
      message: 'Password has been reset successfully',
    };
  }

  private hashResetToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private getBcryptRounds() {
    const parsed = Number(this.configService.get<string>('BCRYPT_ROUNDS'));
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 12;
  }

  private async sendPasswordResetEmail(email: string, resetUrl: string) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') || 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const from = this.configService.get<string>('MAIL_FROM');
    const secure = this.configService.get<string>('SMTP_SECURE') === 'true';

    if (!host || !user || !pass || !from) {
      if (this.configService.get<string>('NODE_ENV') !== 'production') {
        console.warn(`Password reset link for ${email}: ${resetUrl}`);
        return;
      }

      throw new Error('SMTP configuration is incomplete');
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: 'Reset your Job Tracker password',
      text: `Use this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
      html: `<p>Use this link to reset your password:</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in 1 hour.</p>`,
    });
  }
}
