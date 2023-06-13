import { 
  BeforeInsert, Column, CreateDateColumn, Entity, 
  OneToMany, PrimaryGeneratedColumn, UpdateDateColumn 
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column( { unique: true, nullable: false } )
  username: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // eager is something like lazy. In this case, OneToMany means
  // that all tasks will be read after user login
  @OneToMany(_type => Task, task => task.user, { eager: true })
  tasks: Task[];

  // Database triggers
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
