import { Request, Response, Router } from 'express';
import { File, FileChunk } from '../models/index';
import multer from 'multer';
import { deleteDocument, downloadFile, uploadDocument } from '../util/telegram';
import { ApiError } from '../util/error';
import { authenticate } from '../middleware/auth';
import Joi from 'joi';
import { limitPromise } from '../util/promise';

const router = Router();
const upload = multer();

router.use(authenticate);

/**
 * API for creating a file entry in the database.
 * To be used before uploading chunks for a particular file.
 * @body {{ fileName: string, fileType: string }} - The metadata for the file.
 * @response {File} - The created file.
 */
router.post('/create_file', async (request: Request, response: Response) => {
  await Joi.object({
    fileName: Joi.string().required(),
    fileType: Joi.string().required(),
  }).validateAsync(request.body, { abortEarly: false });

  const createdFile = await File.create({
    name: request.body.fileName,
    type: request.body.fileType,
    userId: request.user!.id,
  });

  response.send(createdFile);
});

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
    await Joi.object({
      fileId: Joi.number().optional(),
      order: Joi.number().required(),
    }).validateAsync(request.query, { abortEarly: false });

    const file = request.file;
    if (!file) throw new ApiError({ statusCode: 400, message: 'No file was uploaded' });

    const document = await uploadDocument(file.buffer, file.filename);

    const fileChunk = await FileChunk.create({
      fileId: parseInt(request.query.fileId as string, 10),
      order: parseInt(request.query.order as string, 10),
      telegramId: document.document!.file_id,
      messageId: document.message_id,
    });

    return response.send(fileChunk);
  }
);

/**
 * API for fetching all chunks corresponding to a file.
 * @query {{ fileId: string }} - The id of the file whose chunks to be fetched.
 * @response {{FileChunk[]}} - The fetched chunks.
 */
router.get('/get_file_chunks', async (request: Request, response: Response) => {
  await Joi.object({ fileId: Joi.number().required() }).validateAsync(request.query);

  const fileChunks = await FileChunk.findAll({
    where: { fileId: parseInt(request.query.fileId as string, 10) },
    order: [['order', 'ASC']],
  });

  return response.status(200).send(fileChunks);
});

/**
 * API for fetching buffer for a singular fileChunk.
 * @query {{ fileChunkId: string }} - The id of the file chunk whose buffer to be fetched.
 * @response {ArrayBuffer[]} - The fetched buffer
 */
router.get('/fetch_buffer', async (request: Request, response: Response) => {
  const schema = Joi.object({ fileChunkId: Joi.number().required() });
  await schema.validateAsync(request.query);

  const fileChunk = await FileChunk.findOne({
    where: {
      id: parseInt(request.query.fileChunkId as string, 10),
    },
    include: {
      association: FileChunk.associations.File,
      as: 'file',
    },
  });
  if (!fileChunk) throw new ApiError({ message: 'File chunk not found', statusCode: 404 });

  if (fileChunk.file!.userId !== request.user!.id)
    throw new ApiError({ message: 'file chunk not found', statusCode: 404 });

  const downloadedBuffer = await downloadFile(fileChunk.telegramId);

  response.setHeader('Content-Type', 'application/octet-stream');
  return response.send(Buffer.from(downloadedBuffer));
});

/**
 * API for fetching all the files of a given user.
 * @response {File[]}
 */
router.get('/get_files', async (request: Request, response: Response) => {
  const files = await File.findAll({
    where: { userId: request.user!.id },
  });

  return response.send(files);
});

router.delete('/delete_file', async (request: Request, response: Response) => {
  await Joi.object({ fileId: Joi.number().required() }).validateAsync(request.query);

  const file = await File.findOne({
    where: {
      id: parseInt(request.query.fileId as string, 10),
      userId: request.user!.id,
    },
    include: {
      association: File.associations.FileChunk,
      as: 'fileChunks',
    },
  });
  if (!file) throw new ApiError({ message: 'File not found', statusCode: 404 });

  const deletePromises = file.fileChunks!.map(chunk => deleteDocument(chunk.messageId));

  await limitPromise(deletePromises, 10);

  await file.destroy();

  response.send({ message: 'File deleted successfully' });
});

export default router;
