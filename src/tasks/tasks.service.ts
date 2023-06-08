import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}
  // async getAllTasks(): Promise<Task[]> {
  //   return this.tasks;
  // }
  // async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
  //   const { status, search } = filterDto;
  //   // define a temporary array to hold the result
  //   let tasks = await this.getAllTasks();
  //   // do something with status
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   // dome something with search
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (
  //         task.title.toLowerCase().includes(search.toLocaleLowerCase()) ||
  //         task.description.toLowerCase().includes(search.toLocaleLowerCase())
  //       ) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   return tasks;
  // }
  // deleteTask({ id }: { id: string }): void {
  //   // This should be refactor because this is not effective
  //   // We're trying task with ID which we want to delete by
  //   // using existng mehtong getTaskById which interates every
  //   // array to find task and then we're looping whole array
  //   // again because we want get the error which returns
  //   // getTaskById if task doesn't not exists. Hopefully later
  //   // we will find better solution
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id: id } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" was not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksRepository.createTask(createTaskDto);
  }

  // async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
  //   const task: Task = {
  //     id: uuid(),
  //     title: createTaskDto.title,
  //     description: createTaskDto.description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }
  // async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
