import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { StatusTimeSheet } from 'src/constant/enum/status.enum';

@UseInterceptors(ClassSerializerInterceptor)
export class CreateTimesheetDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'The workingTime is required' })
    workingTime: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'The descripton is required' })
    description: string;

    @IsNotEmpty()
    projectId: number;

    @IsNotEmpty()
    taskId: number;
}
