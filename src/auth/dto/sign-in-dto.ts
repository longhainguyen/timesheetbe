import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
    @ApiProperty({
        example: 'admin',
    })
    @IsNotEmpty({ message: 'The userName is required' })
    @Length(3, 255)
    @IsString()
    userName: string;

    @ApiProperty({
        example: 'admin',
    })
    @IsNotEmpty({ message: 'The password is required' })
    @IsString()
    password: string;
}
