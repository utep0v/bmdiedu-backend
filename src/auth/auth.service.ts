import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async activateAccount(activateAccountDto: ActivateAccountDto) {
    const { token, password } = activateAccountDto;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    await this.usersService.activateUser(token, passwordHash);
    return { message: 'Аккаунт успешно активирован!' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.isActivated) {
      throw new Error('Неверные данные или аккаунт не активирован');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Неверный email или пароль');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
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

    const resetLink = `http://frontend-url.com/reset-password/${resetToken}`;

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
}
