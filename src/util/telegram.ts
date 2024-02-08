import TelegramBot from 'node-telegram-bot-api';
import { jezzterBot } from '../lib/telegram';
import fs from 'fs';

export async function uploadDocument(file: Buffer, fileName: string): Promise<TelegramBot.Message> {
  return jezzterBot.sendDocument(
    process.env.CHAT_ID!,
    file,
    {},
    { contentType: 'application/octet-stream', filename: fileName }
  );
}

export async function downloadFile(telegramId: string): Promise<Uint8Array> {
  const fileChunks: Uint8Array[] = [];

  return new Promise((resolve, reject) => {
    const stream = jezzterBot.getFileStream(telegramId);

    const parseChunks = () => {
      const concatenatedBuffer = new Uint8Array(
        fileChunks.reduce((totalLength, chunk) => totalLength + chunk.length, 0)
      );

      let offset = 0;
      fileChunks.forEach(chunk => {
        concatenatedBuffer.set(chunk, offset);
        offset += chunk.length;
      });

      resolve(concatenatedBuffer);
    };

    stream.on('data', (chunk: Uint8Array) => fileChunks.push(chunk));

    stream.on('error', (error: any) => reject(error));

    stream.on('end', parseChunks);
  });
}

export async function deleteDocument(messageId: number): Promise<boolean> {
  return jezzterBot.deleteMessage(process.env.CHAT_ID!, messageId);
}
