import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserImage } from './entities/user-avatar.entity';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserImage])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService, TypeOrmModule],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes({ path: 'users', method: RequestMethod.GET });
    }
}
