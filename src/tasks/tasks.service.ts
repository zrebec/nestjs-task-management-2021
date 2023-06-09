import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.getAllTasks();
  }

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

  // Delete task by object which we cound in getTaskById
  async deleteTask(id: string): Promise<{}> {
    const foundTask = await this.getTaskById(id);
    return this.tasksRepository.deleteTask(foundTask);
  }

  // Delete task by id parameter (look deleteTaskById in repository for
  // better description)
  deleteTaskById(id: string): Promise<{}> {
    return this.tasksRepository.deleteTaskById(id);
  }

  async getTaskById(id: string): Promise<Task> {
    return this.tasksRepository.getTaskById(id);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }
}
