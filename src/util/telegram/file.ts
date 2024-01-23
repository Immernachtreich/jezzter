import { jezzterBot } from '@/lib/telegram';

export async function uploadDocument(file: Buffer) {
  const response = await jezzterBot.sendDocument('-4194161484', file);
  console.log(response);
}

export async function downloadFile(fileId: string) {
  return new Promise((resolve, reject) => {
    const stream = jezzterBot.getFileStream(fileId); //getting strean to file bytes
    stream.on('data', chunk => {
      console.log('getting data');
    });
    stream.on('error', err => {
      console.log('err');
      reject(err);
    });
    stream.on('end', () => {
      console.log('end');
      resolve({ message: 'done' });
    });
  });
}
