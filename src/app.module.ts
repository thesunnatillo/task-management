import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TasksService } from './modules/tasks/tasks.service';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [AuthModule, TasksModule],
  controllers: [AppController],
  providers: [AppService, TasksService],
})
export class AppModule {}
