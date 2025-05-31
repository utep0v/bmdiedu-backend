import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextContent } from './entity/text-content.entity';
import { UpdateTextContentDto } from './dto/update-text-content.dto';

@Injectable()
export class TextContentService {
  constructor(
    @InjectRepository(TextContent)
    private readonly repo: Repository<TextContent>,
  ) {}

  async get(): Promise<TextContent> {
    const text = await this.repo.findOne({ where: {} });
    if (!text) throw new NotFoundException('Текст не найден');
    return text;
  }

  async update(dto: UpdateTextContentDto): Promise<TextContent> {
    let text = await this.repo.findOne({ where: {} });
    if (!text) {
      text = this.repo.create({ content: dto.content });
    } else {
      text.content = dto.content;
    }
    return this.repo.save(text);
  }

  async getById(id: string): Promise<TextContent> {
    const text = await this.repo.findOne({ where: { id } });
    if (!text) {
      throw new NotFoundException('Текст не найден');
    }
    return text;
  }
}
