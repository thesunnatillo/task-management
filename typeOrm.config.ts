import { DataSource } from 'typeorm';
import { Users } from './src/modules/auth/entities/auth.entity';
import { Tasks } from './src/modules/tasks/entities/task.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  migrations: ['src/database/migrations/**'],
  entities: [Users, Tasks],
});
