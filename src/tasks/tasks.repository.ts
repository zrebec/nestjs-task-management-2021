import { DataSource, Equal, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksRepository extends Repository<Task> {
  // Create logger with context TasksRepository and with timestamp
  private logger = new Logger('TasksRepostitory', {timestamp: true});
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
      user,
    });

    try {
      await this.save(task);
      this.logger.verbose('Task is sucesfully created');
    } catch (error) {
      this.logger.error(`Task is not created. Reason: ${error}`);
    }
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    // filtering tasks by user
    query.where( {user} );

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '( LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search) )',
        { search: `%${search}%` }
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(`
        Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}. Reason: ${error}
        `, error.stack);      
      throw new InternalServerErrorException();
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.save(task);
    return task;
  }

  // The remove method removes the concrete object,
  // so it is important to pass it a concrete object that
  // we want to remove. In this case, it is an object of the Task type
  // which we found in tasks.service.ts
  async deleteTask(task: Task): Promise<object> {
    return await this.remove(task);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.findOneBy( { id, user: Equal(user.id) } );

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" was not found`);
    }
    return found;
  }

  async deleteTaskById(id: string, user: User): Promise<object> {
    // The delete method deletes a record by id, field id or where conditions
    // which are then sold as an object. Thus, the delete method can be
    // delete(1) - removes a specific id
    // delete([1, 2, 3]) - delete id 1, 2 and 3
    // delete({name: 'Thomas'}) - delete records where name is equal to Thomas
    const result = await this.delete(
       {
        id,
        user: Equal(user.id)
      }
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" was not found`);
    }
    return result;
  }
}
