import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  sendActivationEmail(to: string, activationLink: string) {
    const mailOptions = {
      from: 'Bmdiedu.kz',
      to,
      subject: 'Активация аккаунта на сайте bmdiedu.kz',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Добро пожаловать!</h2>
          <p>Для активации вашего аккаунта, пожалуйста, перейдите по ссылке ниже:</p>
          <a href="${activationLink}" style="color: #4CAF50;">Активировать аккаунт</a>
          <br /><br />
          <p>Если вы не запрашивали регистрацию, просто проигнорируйте это письмо.</p>
          <p>Сделано с любовью компанией Synapse</p>
        </div>
      `,
    };
    return this.transporter.sendMail(mailOptions);
  }

  sendPasswordResetEmail(to: string, resetLink: string) {
    const mailOptions = {
      from: '"BMDI EDU"',
      to,
      subject: 'Восстановление пароля',
      html: `
      <h2>Восстановление пароля</h2>
      <p>Чтобы восстановить пароль, перейдите по ссылке:</p>
      <a href="${resetLink}">Сбросить пароль</a>
      <p>Если вы не запрашивали восстановление, просто проигнорируйте это письмо.</p>
    `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
