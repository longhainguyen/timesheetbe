import { IsNotEmpty } from 'class-validator';

export class AddUserToProjectDto {
    @IsNotEmpty()
    userId: number;
    @IsNotEmpty()
    projectId: number;
}
