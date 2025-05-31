import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextContent } from './entity/text-content.entity';
import { TextContentService } from './text-content.service';
import { TextContentController } from './text-content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TextContent])],
  providers: [TextContentService],
  controllers: [TextContentController],
})
export class TextContentModule {}
