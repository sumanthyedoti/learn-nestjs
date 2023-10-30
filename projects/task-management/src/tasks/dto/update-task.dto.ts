import { IsOptional } from 'class-validator'
import { TaskStatus } from '../tasks.model'

export class UpdateTaskDto {
  @IsOptional()
  title: string
  @IsOptional()
  description: string
}
