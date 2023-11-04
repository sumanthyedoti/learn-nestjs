import { BadRequestException, PipeTransform } from '@nestjs/common'
import { taskStatuses } from '../data'

export class TaskStatusValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value) return null
    const valueUpperCase = value.toUpperCase()
    if (!this.isValidStatus(valueUpperCase)) {
      throw new BadRequestException(`${value} is an invalid status`)
    }
    return valueUpperCase
  }

  private isValidStatus(status: any) {
    return taskStatuses.includes(status)
  }
}
