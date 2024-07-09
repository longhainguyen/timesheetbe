import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import * as tmp from 'tmp';
import { Workbook } from 'exceljs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserImage } from 'src/users/entities/user-avatar.entity';

@Injectable()
export class FileService {
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>;

    @InjectRepository(UserImage)
    private readonly userImageRepository: Repository<UserImage>;

    async downloadExcel(data: User[]) {
        if (!data || data.length === 0) {
            throw new NotFoundException('No data to download');
        }

        const sanitizedData = data.map(({ password, ...rest }) => rest);

        const rows = sanitizedData.map((doc) => Object.values(doc));

        const workbook = new Workbook();
        const sheet = workbook.addWorksheet('sheet1');

        rows.unshift(Object.keys(sanitizedData[0]));

        sheet.addRows(rows);

        const file = await new Promise<string>((resolve, reject) => {
            tmp.file(
                { discardDescriptor: true, prefix: 'My report', postfix: '.xlsx', mode: parseInt('0600', 8) },
                async (err, path) => {
                    if (err) {
                        return reject(new BadRequestException(err));
                    }

                    try {
                        await workbook.xlsx.writeFile(path);
                        resolve(path);
                    } catch (error) {
                        reject(new BadRequestException(error));
                    }
                },
            );
        });

        return file;
    }

    async UploadAvatar() {
        // this.userImageRepository
    }
}
