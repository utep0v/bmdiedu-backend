import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async saveFile(file: Express.Multer.File): Promise<FileEntity> {
    return await this.fileRepository.save({
      filename: file.filename,
      path: file.path,
    });
  }

  async findFileById(id: string): Promise<FileEntity | null> {
    return this.fileRepository.findOne({ where: { id } });
  }
}
