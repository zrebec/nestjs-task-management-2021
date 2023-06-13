import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { config } from 'ormconfig';

@Module({
  imports: [
    TasksModule,
    // TODO: Paassword cannot be visible in the source code. It's must be in .env
    //TypeOrmModule.forRoot is for root app. For modules using TypeOrmModule.forFeature
    TypeOrmModule.forRoot(config),
    AuthModule,
  ],
})
export class AppModule {}
