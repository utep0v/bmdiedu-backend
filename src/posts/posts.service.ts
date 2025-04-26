import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  async findAll(
    page = 1,
    size = 10,
    search?: string,
    postType?: string,
  ): Promise<Post[]> {
    const skip = (page - 1) * size;
    const where: any = {};

    if (search) {
      where.title = Like(`%${search}%`);
    }
    if (postType) {
      where.postType = postType;
    }

    return this.postRepository.find({
      where,
      skip,
      take: size,
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string): Promise<Post | null> {
    return this.postRepository.findOneBy({ id });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null> {
    await this.postRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }
}
