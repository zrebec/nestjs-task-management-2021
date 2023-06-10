import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TasksModule,
    // TODO: Paassword cannot be visible in the source code. It's must be in .env
    //TypeOrmModule.forRoot is for root app. For modules using TypeOrmModule.forFeature
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgress',
      database: 'task-management',
      autoLoadEntities: true,
      // synchronize to true is good for development but not for production
      synchronize: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
