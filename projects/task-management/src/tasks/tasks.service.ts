import { Injectable, NotFoundException } from '@nestjs/common'
import { Task, TaskStatus } from './tasks.model'
import { v4 as uuidv4 } from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto'
import { FilterTasksDto } from './dto/filter-taks-dto'

@Injectable()
export class TasksService {
  private tasks: Task[] = []

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto
    const task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    }

    this.tasks.push(task)
    return task
  }

  getTasks(filters: FilterTasksDto): Task[] {
    if (Object.keys(filters).length > 0) {
      return this.getFilteredTasks(filters)
    }
    return this.tasks
  }

  private getFilteredTasks(filters: FilterTasksDto): Task[] {
    const { status, search } = filters
    let tasks = this.tasks
    if (status) {
      tasks = tasks.filter((t) => t.status === status)
    }
    if (search) {
      tasks = tasks.filter((t) => t.title.includes(search))
    }
    return tasks
  }

  getTask(id: string): Task {
    return this.tasks.find((t) => t.id === id)
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((t) => t.id !== id)
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.tasks.find((t) => t.id === id)
    if (!task) {
      throw new NotFoundException()
    }
    task.status = status
    return task
  }
}
