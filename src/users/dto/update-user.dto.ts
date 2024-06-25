import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateRoleUserDto extends PartialType(PickType(CreateUserDto, ['role'] as const)) {}
