import { IsOptional } from 'class-validator'
import { TaskStatus } from '../tasks.model'

export class FilterTasksDto {
  @IsOptional()
  search: string
  @IsOptional()
  status: TaskStatus
}
