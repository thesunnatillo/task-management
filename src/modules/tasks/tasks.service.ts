import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from './entities/task.entity';
import { In, LessThan, Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { Users } from '../auth/entities/auth.entity';
import { RedisService } from '../../redis/redis.service';
import { InvalidCode } from '../auth/exception/auth.exception';
import { UpdateDto } from './dto/update.dto';
import { DoNotAllow } from './exception/tasks.exception';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(Tasks)
    private readonly tasksRepo: Repository<Tasks>,
    private readonly redisService: RedisService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async archivedTask() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const oldTasks = await this.tasksRepo.find({
      where: {
        status: 'completed',
        createdAt: LessThan(oneWeekAgo),
      },
    });

    for (const task of oldTasks) {
      task.status = 'archived';
      await this.tasksRepo.save(task);
    }

    console.log(`${oldTasks.length} ta vazifa arxivlandi`);
  }

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

  async getAll(encoded: string) {
    const username = Buffer.from(encoded, 'base64')
      .toString('ascii')
      .split(':')[0];
    const user = await this.usersRepo.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new InvalidCode();
    }

    return await this.tasksRepo.find({
      where: {
        status: In(['completed', 'pending']),
        user: { id: user.id },
      },
    });
  }

  async update(updateDto: UpdateDto, task_id: number, encoded: string) {
    const username = Buffer.from(encoded, 'base64')
      .toString('ascii')
      .split(':')[0];
    const user = await this.usersRepo.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new InvalidCode();
    }

    const task = await this.tasksRepo.findOne({
      where: { id: task_id },
      relations: ['user'],
    });
    if (!task) {
      return {
        message: 'Not found',
      };
    }
    if (task.user.id !== user.id) {
      throw new DoNotAllow();
    }

    await this.tasksRepo.update(task_id, { ...updateDto });
    await this.redisService.del(`task:${task_id}`);
    return {
      message: 'Updated',
    };
  }

  async delete(task_id: number, encoded: string) {
    const username = Buffer.from(encoded, 'base64')
      .toString('ascii')
      .split(':')[0];
    const user = await this.usersRepo.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new InvalidCode();
    }

    const task = await this.tasksRepo.findOne({
      where: { id: task_id },
      relations: ['user'],
    });
    if (!task) {
      return {
        message: 'Not found',
      };
    }

    await this.tasksRepo.remove(task);
    return {
      message: 'Task Deleted',
    };
  }

  async getOne(task_id: number, encoded: string) {
    const username = Buffer.from(encoded, 'base64')
      .toString('ascii')
      .split(':')[0];
    const user = await this.usersRepo.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new InvalidCode();
    }

    const fromRedis = await this.redisService.get(`task:${task_id}`);
    const task_from_redis = JSON.parse(fromRedis);

    if (fromRedis) {
      if (task_from_redis.user.id !== user.id) {
        throw new DoNotAllow();
      } else {
        return task_from_redis;
      }
    } else {
      const task = await this.tasksRepo.findOne({
        where: { id: task_id },
        relations: ['user'],
      });

      if (!task) {
        return {
          message: 'Not found',
        };
      }

      if (task.user.id !== user.id) {
        throw new DoNotAllow();
      }

      await this.redisService.set(`task:${task_id}`, JSON.stringify(task));

      return task;
    }
  }
}
