import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from './entities/task.entity';
import { Users } from '../auth/entities/auth.entity';
import { RedisService } from '../../redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tasks, Users])],
  controllers: [TasksController],
  providers: [TasksService, RedisService],
})
export class TasksModule {}
