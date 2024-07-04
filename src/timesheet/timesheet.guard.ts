import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TimesheetService } from './timesheet.service';
import { Timesheet } from './entities/timesheet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TimesheetOwnerGuard implements CanActivate {
    constructor(
        @InjectRepository(Timesheet)
        private readonly timesheetRepository: Repository<Timesheet>,

        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const timesheetId = request.params.id;

        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }

        const timesheet = await this.timesheetRepository.findOne({
            where: {
                id: timesheetId,
            },
            relations: ['user'],
        });

        if (!timesheet) {
            throw new NotFoundException('Timesheet not found');
        }

        if (timesheet.user.id !== user.sub) {
            throw new UnauthorizedException('You do not have permission to summit this timesheet');
        }

        return true;
    }
}
