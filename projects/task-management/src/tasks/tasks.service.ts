import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTaskDto } from './dto/create-task.dto'
import { FilterTasksDto } from './dto/filter-taks-dto'
import { TaskStatus } from './types'
import { TaskRepository } from './task.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Task } from './task.entity'
import { User } from 'src/auth/user.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  // private async getFilteredTasks(filters: FilterTasksDto): Task[] {
  //   const { status, search } = filters
  //   let tasks = this.tasks
  //   if (status) {
  //     tasks = await this.taskRepository.
  //   }
  //   if (search) {
  //     tasks = tasks.filter((t) => t.title.includes(search))
  //   }
  //   return tasks
  // }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id, userid: user.id })
    if (!task) {
      throw new NotFoundException()
    }
    return task
  }

  createTask(createTaskDto: CreateTaskDto, user: User) {
    const { title, description } = createTaskDto
    const data = {
      title,
      description,
      status: TaskStatus.OPEN,
      userid: user.id,
    }
    const task = this.taskRepository.create(data)
    return this.taskRepository.save(task)
  }

  getTasks(filterDto: FilterTasksDto, user: User) {
    const { search, status } = filterDto
    const query = this.taskRepository.createQueryBuilder()
    query.where('userid = :userid', { userid: user.id })
    if (status) {
      query.andWhere('status = :status', { status })
    }
    if (search) {
      query.andWhere('(title LIKE :search OR description LIKE :search)', {
        search: `%${search}%`,
      })
    }
    return query.getMany()
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userid: user.id })
    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id, user })
    if (!task) {
      throw new NotFoundException()
    }
    task.status = status
    return this.taskRepository.save(task)
  }
}
