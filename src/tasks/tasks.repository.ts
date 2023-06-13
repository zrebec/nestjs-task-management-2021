import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
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

    await this.save(task);
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

    const tasks = await query.getMany();
    return tasks;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
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

  async getTaskById(id: string): Promise<Task> {
    const found = await this.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" was not found`);
    }
    return found;
  }

  async deleteTaskById(id: string): Promise<object> {
    // The delete method deletes a record by id, field id or where conditions
    // which are then sold as an object. Thus, the delete method can be
    // delete(1) - removes a specific id
    // delete([1, 2, 3]) - delete id 1, 2 and 3
    // delete({name: 'Thomas'}) - delete records where name is equal to Thomas
    const result = await this.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" was not found`);
    }
    return result;
  }
}
