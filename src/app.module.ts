import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { TextContentModule } from './text-content/text-content.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // DEBUG: Смотрим, что реально пришло из env
        const host = configService.get<string>('DB_HOST');
        const portRaw = configService.get<string>('DB_PORT'); // читаем как строку
        const port = portRaw ? parseInt(portRaw, 10) : 5432; // приводим к числу
        const username = configService.get<string>('DB_USERNAME');
        const password = configService.get<string>('DB_PASSWORD');
        const database = configService.get<string>('DB_DATABASE');
        console.log('DB CONFIG:', { host, port, username, password, database }); // debug!

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [],
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    PostsModule,
    UsersModule,
    AuthModule,
    FilesModule,
    TextContentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}