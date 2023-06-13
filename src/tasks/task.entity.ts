import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // eager is something like lazy. In this case, OneToMany means
  // that all user will be load only if task is invoked. This is
  // a question for a performance
  // Exclude toPlainOnly exlude plain text infromations
  @ManyToOne(_type => User, user => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
