import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Header,
    Res,
    StreamableFile,
    UseInterceptors,
    ClassSerializerInterceptor,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { createReadStream } from 'fs';
import { extname, join } from 'path';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@ApiTags('file')
@Controller('file')
@UseInterceptors(ClassSerializerInterceptor)
export class FileController {
    constructor(
        private readonly fileService: FileService,
        private readonly usersService: UsersService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    @Public()
    @Get('/download/all-users')
    @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    async downloadReport(@Res() res: Response) {
        const data = await this.usersService.findAll();
        const result = await this.fileService.downloadExcel(data);
        res.download(`${result}`);
    }

    @Get()
    getFile(@Res() res: Response) {
        const file = createReadStream(
            join(process.cwd(), 'upload/My report-15768-L4MlwirRVcgJ-.xlsx-1720423611275_838445514.xlsx'),
        );
        file.pipe(res);
    }

    @Public()
    @Post('upload-local')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './upload',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return {
            message: 'Success',
        };
    }

    @Public()
    @Post('upload-cloud')
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        return this.cloudinaryService.uploadFile(file);
    }
}
