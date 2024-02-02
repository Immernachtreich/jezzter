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

/**
 * API to upload chunks of a file to Telegram and store it.
 * If parent file is not specified a new file is created.
 * @query {{ fileId: string, order: string, fileType: string }} - The details of the file to upload
 * @file {Express.Multer.File} - The chunk of the file to be uploaded
 * @response {{ fileId: number, message: string }} - The ID of the file that was passed or created.
 */
router.post(
  '/file_upload',
  upload.single('chunk'),
  async (request: Request, response: Response) => {
    const schema = Joi.object({
      fileName: Joi.string().required(),
      fileId: Joi.string().optional(),
      order: Joi.string().required(),
      fileType: Joi.string().required(),
    });
    await schema.validateAsync(request.query, { abortEarly: false });

    const file = request.file;
    if (!file) throw new ApiError({ statusCode: 400, message: 'No file was uploaded' });

    let fileId: number = parseInt(request.query.fileId as string, 10);

    const document = await uploadDocument(file.buffer);

    if (!fileId) {
      const createdFile = await File.create({
        name: request.query.fileName as string,
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

router.get('/get_file_chunks', async (request: Request, response: Response) => {
  const schema = Joi.object({ fileId: Joi.string().required() });
  await schema.validateAsync(request.query);

  const fileId: number = parseInt(request.query.fileId as string, 10);

  const file = await File.findOne({
    where: { id: fileId, userId: request.user?.id },
    raw: true,
  });
  if (!file) throw new ApiError({ message: 'File not found', statusCode: 404 });

  const fileChunks = await FileChunk.findAll({
    where: { fileId },
    order: [['order', 'ASC']],
  });

  response.status(200).send(fileChunks);
});

router.get('/fetch_buffer', async (request: Request, response: Response) => {
  const schema = Joi.object({ fileChunkId: Joi.string().required() });
  await schema.validateAsync(request.query);

  const fileChunkId: number = parseInt(request.query.fileChunkId as string, 10);

  const fileChunk = await FileChunk.findOne({
    where: { id: fileChunkId },
    include: { association: FileChunk.associations.File, as: 'file' },
  });
  if (!fileChunk) throw new ApiError({ message: 'File chunk not found', statusCode: 404 });

  if (fileChunk.file!.userId !== request.user!.id)
    throw new ApiError({ message: 'file chunk not found', statusCode: 404 });

  const downloadedBuffer = await downloadFile(fileChunk.telegramId);

  response.setHeader('Content-Type', 'application/octet-stream');
  response.send(Buffer.from(downloadedBuffer));
});

router.get('/get_files', async (request: Request, response: Response) => {
  const schema = Joi.object({ fileId: Joi.string().required() });
  await schema.validateAsync(request.query);

  const files = await File.findAll({
    where: { userId: parseInt(request.query.userId as string, 10) },
  });

  return response.send(files);
});

export default router;
