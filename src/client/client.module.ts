import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Client]), UsersModule],
    controllers: [ClientController],
    providers: [ClientService],
    exports: [ClientService, TypeOrmModule],
})
export class ClientModule {}
