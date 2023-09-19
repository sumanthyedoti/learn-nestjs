import { Controller, Get } from "@nestjs/common";

@Controller('/api')
export class AppController {
  @Get()
  @Get('hello')
  sayHello() {
    return "Hello world!"
  }

  @Get('/bye')
  sayBye() {
    return "Bye world!"
  }
}
