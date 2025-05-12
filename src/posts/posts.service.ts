import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly filesService: FilesService,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const { coverUrl, ...otherData } = createPostDto;

    if (coverUrl) {
      const file = await this.filesService.findFileById(coverUrl);
      if (!file) {
        throw new Error('Файл с таким ID не найден');
      }
    }

    const post = this.postRepository.create({
      ...otherData,
      coverUrl,
      authorId: userId,
    });

    return this.postRepository.save(post);
  }

  async findAll(page = 1, size = 10, search?: string, postType?: string) {
    const skip = (page - 1) * size;
    const where: any = {};

    if (search) {
      where.title = ILike(`%${search}%`);
    }
    if (postType) {
      where.postType = postType;
    }

    const [posts, total] = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .select(['post', 'author.id', 'author.name', 'author.email'])
      .where(where)
      .skip(skip)
      .take(size)
      .orderBy('post.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: posts,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  findOne(id: string): Promise<Post | null> {
    return this.postRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post | null> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new Error('Пост не найден');
    }

    await this.postRepository.update(id, {
      ...updatePostDto,
      authorId: userId,
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }
}
