import TelegramBot from 'node-telegram-bot-api';
import { jezzterBot } from '../lib/telegram';

export async function uploadDocument(file: Buffer): Promise<TelegramBot.Message> {
  return jezzterBot.sendDocument(
    process.env.CHAT_ID!,
    file,
    {},
    { contentType: 'application/octet-stream' }
  );
}

export async function downloadFile(fileId: string) {
  const fileChunks = [];

  return new Promise((resolve, reject) => {
    const stream = jezzterBot.getFileStream(fileId);
    stream.on('data', chunk => fileChunks.push(chunk));
    stream.on('error', error => {
      console.error(error);
      reject(error);
    });
    stream.on('end', () => resolve({ message: 'done' }));
  });
}
