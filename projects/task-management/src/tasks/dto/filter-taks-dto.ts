import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator'
import { TaskStatus } from '../types'
import { taskStatuses } from '../data'
import { Transform } from 'class-transformer'

export class FilterTasksDto {
  @IsOptional()
  @IsString()
  search: string

  @IsOptional()
  @IsEnum(TaskStatus)
  @Transform(({ value }) => value.toUpperCase())
  status: TaskStatus
}
