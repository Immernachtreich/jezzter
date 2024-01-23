import { NextApiRequest, NextApiResponse } from 'next';
import { Files, IncomingForm, File as formidableFile } from 'formidable';
import { File } from '@/models/index';
import fs from 'fs';
import path from 'path';
import { uploadDocument } from '@/util/telegram/file';
import { breakFileIntoChunks } from '@/util/file';
import { sequelize } from '@/models/index';
import { Transaction } from '@sequelize/core';

export const config = { api: { bodyParser: false } };

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const form = new IncomingForm();
    const { files } = await new Promise<{ files: Files }>((resolve, reject) => {
      form.parse(request, (err, _fields, files) => (err ? reject(err) : resolve({ files })));
    });

    if (!files.files || !files.files.length) throw new Error(`No files were found`);
    const parsedFiles: formidableFile[] = files.files;

    /**
     * Files will contain multiple files.
     * Multiple files will need to be broken up into chunks of 2GB each.
     * Then the file and the chunk data need to be stored after successful upload of said chunk.
     * All the creation of files and its data needs to be done in a transaction.
     * TODO: on unsuccesfull upload of any file or file chunk, all the remaining file chunks need to be delete from telegram.
     */

    const failedUploads: formidableFile[] = [];

    for await (const file of parsedFiles) {
      const fileBuffer = fs.readFileSync(path.join(file.filepath));
      const chunks = breakFileIntoChunks(fileBuffer);

      try {
        await sequelize.transaction(async (transaction: Transaction) => {
          const fileModules: string[] = file.filepath.split('.');
          const fileExtention: string = fileModules[fileModules.length - 1];

          // await File.create({
          //   name: file.originalFilename!,
          //   path: file.filepath,
          //   type: fileExtention,
          //   userId: request.user.id
          // })
        });
      } catch (error: any) {
        console.error(error);
        failedUploads.push(file);
      }
    }

    // await uploadDocument(fileBuffer);

    response.send({});
  } catch (error: any) {
    console.error(error);
    response.status(501).send({ error: error.message });
  }
};

export default handler;
