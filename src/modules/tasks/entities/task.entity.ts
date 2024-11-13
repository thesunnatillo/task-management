import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../auth/entities/auth.entity';

@Entity('tasks')
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  dueDate: Date;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Users, (user) => user.tasks, { onDelete: 'CASCADE' })
  user: Users;
}
