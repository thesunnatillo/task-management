import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TasksService } from './modules/tasks/tasks.service';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [AuthModule, TasksModule],
  controllers: [],
  providers: [TasksService],
})
export class AppModule {}
