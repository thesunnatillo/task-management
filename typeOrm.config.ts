import { DataSource } from 'typeorm';
import { Users } from './src/modules/auth/entities/auth.entity';
import { Tasks } from './src/modules/tasks/entities/task.entity';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
dotenv.config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST'),
  port: configService.get<number>('POSTGRES_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DATABASE'),
  migrations: ['src/database/migrations/**'],
  entities: [Users, Tasks],
});
