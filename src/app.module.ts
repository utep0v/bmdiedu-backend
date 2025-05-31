import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import { TextContentModule } from './text-content/text-content.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'stalker1803',
      database: 'wordpress_pg',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
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
