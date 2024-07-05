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
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/users/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/constant/enum/role.enum';
import { ParseDataToIntPipe } from 'src/pipe/parse-int.pipe';

@ApiTags('client')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('client')
@UseInterceptors(ClassSerializerInterceptor)
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Post()
    async create(@Request() req, @Body() createClientDto: CreateClientDto) {
        return await this.clientService.create(req, createClientDto);
    }

    @Get()
    findAll() {
        return this.clientService.findAll();
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
