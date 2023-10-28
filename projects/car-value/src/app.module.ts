import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { CarsModule } from './cars/cars.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './users/user.entity'
import { Car } from './cars/car.entity'
import { APP_PIPE } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
var cookieSession = require('cookie-session')

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Car],
          synchronize: true,
        }
      },
    }),
    UsersModule,
    CarsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['key-used-to-encrypt'],
        }),
      )
      .forRoutes('*')
  }
}
