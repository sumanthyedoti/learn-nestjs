import { Controller, Get, HttpStatus, Logger } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    Logger.log("Health check success")
    return HttpStatus.OK
  }
}
