import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { Users } from '../auth/entities/auth.entity';
import { RedisService } from '../../redis/redis.service';
import { InvalidCode } from '../auth/exception/auth.exception';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(Tasks)
    private readonly tasksRepo: Repository<Tasks>,
    private readonly redisService: RedisService,
  ) {}

  async create(createDto: CreateDto, encoded: string) {
    const username = Buffer.from(encoded, 'base64')
      .toString('ascii')
      .split(':')[0];
    const user = await this.usersRepo.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new InvalidCode();
    }

    const newTask = {
      ...createDto,
      user: user,
    };

    const savedTask = await this.tasksRepo.save(newTask);
    await this.redisService.set(
      `task:${savedTask.id}`,
      JSON.stringify(savedTask),
    );

    return savedTask;
  }

  async getAll() {}

  async update() {}

  async delete() {}

  async getOne() {}
}
