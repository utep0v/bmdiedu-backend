import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { TextContentService } from './text-content.service';
import { UpdateTextContentDto } from './dto/update-text-content.dto';
import { TextContent } from './entity/text-content.entity';

@Controller('text-content')
export class TextContentController {
  constructor(private readonly service: TextContentService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Put()
  update(@Body() dto: UpdateTextContentDto) {
    return this.service.update(dto);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<TextContent> {
    return this.service.getById(id);
  }
}
