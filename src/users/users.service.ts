import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  findByActivationToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { activationToken: token } });
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async activateUser(token: string, passwordHash: string): Promise<User> {
    const user = await this.findByActivationToken(token);
    if (!user) {
      throw new Error('Invalid or expired activation link.');
    }
    user.password = passwordHash;
    user.isActivated = true;
    user.activationToken = null as any;
    return this.userRepository.save(user);
  }

  async findAllUsers(page: number, size: number, search: string) {
    const [users, total] = await this.userRepository.findAndCount({
      where: search ? { name: ILike(`%${search}%`) } : {},
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { resetToken: token } });
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('Пользователь не найден.');
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async removeUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('Пользователь не найден.');
    }

    await this.userRepository.remove(user);
    return { message: 'Пользователь успешно удалён.' };
  }
}
