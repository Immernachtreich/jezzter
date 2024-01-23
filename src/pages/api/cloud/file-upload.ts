import { NextApiRequest, NextApiResponse } from 'next';
import { Fields, Files, IncomingForm } from 'formidable';
import fs from 'fs';
import { jezzterBot } from '@/lib/telegram';
import path from 'path';
import { uploadDocument } from '@/util/telegram/file';

export const config = { api: { bodyParser: false } };

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const form = new IncomingForm();
    const { files } = await new Promise<{ files: Files }>((resolve, reject) => {
      form.parse(request, (err, _fields, files) => (err ? reject(err) : resolve({ files })));
    });

    const fileBuffer = fs.readFileSync(path.join(files['files']?.[0].filepath!));

    await uploadDocument(fileBuffer);

    response.send({});
  } catch (error: any) {
    console.error(error);
    response.status(501).send({ error: error.message });
  }
};

export default handler;
