import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';
import { Branch } from 'src/constant/enum/branch.enum';
import { Role } from 'src/constant/enum/role.enum';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'The userName is required' })
    @Length(3, 255)
    @IsString()
    userName: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'The password is required' })
    @IsString()
    // @MinLength(8)
    // @MaxLength(20)
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //     message:
    //         'Passwords will contain at least 1 upper case letter, Passwords will contain at least 1 lower case letter, Passwords will contain at least 1 number or special character, There is no length validation (min, max) in this regex!',
    // })
    password: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty({ message: 'The email is required' })
    email: string;

    @IsIn([Role.ADMIN, Role.MANAGER, Role.STAFF, undefined], { message: 'Role must be either admin, staff or manager' })
    role: string;

    @ApiProperty()
    @IsIn([Branch.DN, Branch.HN1, Branch.HN2, undefined], { message: 'Invalid branch' })
    branch: string;

    isActive: boolean;
    manageId: number;
}
