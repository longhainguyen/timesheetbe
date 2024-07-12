import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Inject,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/users/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/constant/enum/role.enum';
import { ParseDataToIntPipe } from 'src/pipe/parse-int.pipe';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiTags('client')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('client')
@UseInterceptors(ClassSerializerInterceptor)
export class ClientController {
    constructor(
        private readonly clientService: ClientService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Post()
    async create(@Request() req, @Body() createClientDto: CreateClientDto) {
        return await this.clientService.create(req, createClientDto);
    }

    @Get()
    @UseInterceptors(CacheInterceptor)
    findAll() {
        return this.clientService.findAll();
    }

    @Get('/test-cache/')
    async demoGetCache() {
        return await this.cacheManager.get('newnet');
    }

    @Post('/test-cache/')
    async demoPstCache() {
        await this.cacheManager.set('newnet', 'hello');
        return true;
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.clientService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id', new ParseDataToIntPipe()) id: string, @Body() updateClientDto: UpdateClientDto) {
        return this.clientService.update(+id, updateClientDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.clientService.remove(+id);
    }
}
