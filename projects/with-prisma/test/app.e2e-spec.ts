import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  beforeAll(async() => {
    const moduleref = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
  })
  test.todo("test_message")
});
