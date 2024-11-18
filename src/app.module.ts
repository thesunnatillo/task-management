import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './modules/auth/entities/auth.entity';
import { Tasks } from './modules/tasks/entities/task.entity';
import * as dotenv from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidation } from './env.validation';
dotenv.config();

const configService = new ConfigService();

@Module({
  imports: [
    AuthModule,
    TasksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidation,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configService.get<string>('POSTGRES_HOST'),
      port: configService.get<number>('POSTGRES_PORT'),
      username: configService.get<string>('POSTGRES_USER'),
      password: configService.get<string>('POSTGRES_PASSWORD'),
      database: configService.get<string>('POSTGRES_DATABASE'),
      entities: [Users, Tasks],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
