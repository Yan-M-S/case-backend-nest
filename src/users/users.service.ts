import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly baseCacheKey = 'users';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async registerUser(data: CreateUserDto): Promise<User> {
    const userExists = await this.userRepository.findOneBy({ email: data.email });
    if (userExists) {
      throw new ConflictException('Já existe esse email cadastrado!');
    }

    const newUser = this.userRepository.create(data);
    const created = await this.userRepository.save(newUser);

    await this.clearUserCache();

    return created;
  }

  async getAllUsers(): Promise<User[]> {
    const cache = await this.cacheManager.get<User[]>(this.baseCacheKey);
    if (cache) return cache;

    const users = await this.userRepository.find();
    await this.cacheManager.set(this.baseCacheKey, users, 60);

    return users;
  }

  async getUserById(userId: number): Promise<User | null> {
    const cacheKey = this.getUserCacheKey(userId);
    const cached = await this.cacheManager.get<User>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      await this.cacheManager.set(cacheKey, user, 60);
    }

    return user;
  }

  async updateUser(userId: number, updates: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    const merged = this.userRepository.merge(user, updates);
    const saved = await this.userRepository.save(merged);

    await this.clearUserCache();

    return saved;
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    await this.userRepository.delete(userId);
    await this.clearUserCache();
  }

  private getUserCacheKey(userId: number): string {
    return `${this.baseCacheKey}:${userId}`;
  }

  private async clearUserCache(): Promise<void> {
    await this.cacheManager.del(this.baseCacheKey);
  }
}
