import { User } from 'src/auth/user.entity';
import { Task } from 'src/tasks/task.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const config: PostgresConnectionOptions = {
  type:       'postgres',
  database:   'task-management',
  host:       'localhost',
  port:       5432,
  username:   'postgres',
  password:   'postgress',
  // synchronize to true is good for development but not for production
  synchronize: true,
  // second alternative is using autoLoadEntinties but it's not supported
  // in PosgresConnectionOptions
  entities:   [User, Task]
};