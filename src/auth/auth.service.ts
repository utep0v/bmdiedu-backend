import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async activateAccount(activateAccountDto: ActivateAccountDto) {
    const { token, password } = activateAccountDto;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    await this.usersService.activateUser(token, passwordHash);
    return { message: 'Аккаунт успешно активирован!' };
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    user.refreshToken = refreshToken;
    await this.usersService.saveUser(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new Error('Пользователь с таким email не найден.');
    }

    const resetToken = uuidv4();
    user.resetToken = resetToken;
    await this.usersService.saveUser(user);

    const resetLink = `https://bmdiedu.kz/auth/reset-password/${resetToken}`;

    await this.mailService.sendPasswordResetEmail(user.email, resetLink);

    return { message: 'Письмо для восстановления отправлено на почту.' };
  }

  // Reset Password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      throw new Error('Неверная или истёкшая ссылка.');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = null as any;
    user.isActivated = true;

    await this.usersService.saveUser(user);

    return { message: 'Пароль успешно обновлён!' };
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new Error('Отсутствует refresh token');
    }

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    const user = await this.usersService.findById(payload.sub);

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Неверный refresh token');
    }

    const newAccessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { access_token: newAccessToken };
  }
}
