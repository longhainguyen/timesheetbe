import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Role } from 'src/constant/enum/role.enum';

@Injectable()
export class RoleValidationPipe implements PipeTransform<string, Role> {
    private readonly allowedRoles = [Role.ADMIN, Role.MANAGER, Role.STAFF];
    transform(value: any, metadata: ArgumentMetadata): Role {
        if (!(this.allowedRoles.indexOf(value) > -1)) {
            throw new BadRequestException(`Invalid role: ${value}`);
        }
        return value;
    }
}
