import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tasks } from '../../tasks/entities/task.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  hash: string;

  @OneToMany(() => Tasks, (tasks) => tasks.user)
  tasks: Tasks[];
}
