import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
    storage: diskStorage({
        destination: './upload',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
            callback(null, filename);
        },
    }),
};
