import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    return this.find();
  }

  // The remove method removes the concrete object,
  // so it is important to pass it a concrete object that
  // we want to remove. In this case, it is an object of the Task type
  // which we found in tasks.service.ts
  async deleteTask(task: Task): Promise<void> {
    await this.remove(task);
  }

  async deleteTaskById(id: string): Promise<void> {
    // The delete method deletes a record by id, field id or where conditions
    // which are then sold as an object. Thus, the delete method can be
    // delete(1) - removes a specific id
    // delete([1, 2, 3]) - delete id 1, 2 and 3
    // delete({name: 'Thomas'}) - delete records where name is equal to Thomas
    await this.delete(id);
  }
}
