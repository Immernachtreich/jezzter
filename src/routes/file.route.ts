import { Request, Response, Router } from 'express';
import { File, FileChunk } from '../models/index';
import multer from 'multer';
import { downloadFile, uploadDocument } from '../util/telegram';
import { ApiError } from '../util/error';
import { authenticate } from '../middleware/auth';
import Joi from 'joi';

const router = Router();

const upload = multer();

router.use(authenticate);

router.post(
  '/file_upload',
  upload.single('chunk'),
  async (request: Request, response: Response) => {
    const schema = Joi.object({
      fileId: Joi.string().optional(),
      order: Joi.string().required(),
      fileType: Joi.string().required(),
    });
    await schema.validateAsync(request.query, { abortEarly: false });

    const file = request.file;
    let fileId: number = parseInt(request.query.fileId as string, 10);

    if (!file) throw new ApiError({ statusCode: 400, message: 'No file was uploaded' });

    const document = await uploadDocument(file!.buffer);

    if (!fileId) {
      const createdFile = await File.create({
        name: file.originalname,
        type: request.query.fileType as string,
        userId: request.user!.id,
      });
      fileId = createdFile.id;
    }

    await FileChunk.create({
      fileId,
      order: parseInt(request.query.order as string, 10),
      telegramId: document.document!.file_id,
    });

    response.send({ fileId: fileId, message: 'Done' });
  }
);

router.get('/get_file', async (request: Request, response: Response) => {
  const schema = Joi.object({ fileId: Joi.string().required() });
  await schema.validateAsync(request.query);

  const file = await File.findByPk(request.query.fileId);
  if (!file)
    throw new ApiError({ message: 'Invalid file id', statusCode: 400 });
});

export default router;
