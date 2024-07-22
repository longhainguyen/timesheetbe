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
    Query,
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
import { CACHE_KEY_CLIENT } from 'src/constant/key-cache/key';
import { PaginationDto } from './dto/pagination-dto';
import { LRUCache } from 'lru-cache';
import { Client } from './entities/client.entity';

@ApiTags('client')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('client')
@UseInterceptors(ClassSerializerInterceptor)
export class ClientController {
    options = {
        max: 3,

        // for use with tracking overall storage size
        maxSize: 5000,
        sizeCalculation: (value, key) => {
            return 1;
        },

        // how long to live in ms
        ttl: 1000 * 60 * 5,

        // return stale items before removing from cache?
        allowStale: false,

        updateAgeOnGet: false,
        updateAgeOnHas: false,

        // async method to use for cache.fetch(), for
        // stale-while-revalidate type of behavior
        fetchMethod: async (key, staleValue, { options, signal, context }) => {},
    };

    cache = new LRUCache(this.options);

    constructor(
        private readonly clientService: ClientService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Post()
    async create(@Request() req, @Body() createClientDto: CreateClientDto) {
        return await this.clientService.create(req, createClientDto);
    }

    @Get()
    async findAll(@Query() paginationDto: PaginationDto) {
        return await this.clientService.findAll(paginationDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        // const cacheKey = `${CACHE_KEY_CLIENT}${id}`;
        // const cachedData = await this.cacheManager.get(cacheKey);

        // if (cachedData) {
        //     return cachedData;
        // }
        // const client = await this.clientService.findOne(+id);
        // await this.cacheManager.set(cacheKey, client, { ttl: 300 });

        // return client;

        const cachedClient = this.cache.get(`${CACHE_KEY_CLIENT}${id}`);
        if (cachedClient) {
            return cachedClient;
        }

        const client = await this.clientService.findOne(+id);
        if (client) {
            this.cache.set(`${CACHE_KEY_CLIENT}${id}`, client);
        }

        return client;
    }

    @Patch(':id')
    async update(@Param('id', new ParseDataToIntPipe()) id: string, @Body() updateClientDto: UpdateClientDto) {
        const updatedClient = await this.clientService.update(+id, updateClientDto);
        const cacheKey = `${CACHE_KEY_CLIENT}${id}`;
        // await this.cacheManager.del(cacheKey);
        // await this.cacheManager.set(cacheKey, updatedClient, { ttl: 300 });

        this.cache.delete(cacheKey);
        this.cache.set(`${CACHE_KEY_CLIENT}${id}`, updatedClient);

        return updatedClient;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const cacheKey = `${CACHE_KEY_CLIENT}${id}`;
        // await this.cacheManager.del(cacheKey);
        this.cache.delete(cacheKey);
        return await this.clientService.remove(+id);
    }
}
