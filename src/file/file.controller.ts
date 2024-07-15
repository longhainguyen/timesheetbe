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
import { multerConfig } from 'src/config/multer.config';

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

    @Public()
    @Get()
    getFile(@Res() res: Response) {
        const file = createReadStream(join(process.cwd(), 'upload/sam.jpg-1720433768144_21261130.jpg'));
        // console.log(file);
        file.pipe(res);
    }

    @Public()
    @Post('upload-local')
    @UseInterceptors(FileInterceptor('file', multerConfig))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return file.path;
    }

    @Public()
    @Post('upload-cloud')
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        return this.cloudinaryService.uploadFile(file);
    }
}
