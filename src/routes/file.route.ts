import { Request, Response, Router } from 'express';
import Joi from 'joi';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { uploadDocument } from '../util/telegram';
import { ApiError } from '../util/error';

const router = Router();

const upload = multer();

router.post(
  '/file_upload',
  upload.single('chunk'),
  async (request: Request, response: Response) => {
    if (!request.file) throw new ApiError({ statusCode: 400, message: 'No file was uploaded' });

    await uploadDocument(request.file!.buffer);
    response.send({ message: 'Done' });
  }
);

export default router;
