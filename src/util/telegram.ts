import TelegramBot from 'node-telegram-bot-api';
import { jezzterBot } from '../lib/telegram';
import fs from 'fs';

export async function uploadDocument(file: Buffer): Promise<TelegramBot.Message> {
  return jezzterBot.sendDocument(
    process.env.CHAT_ID!,
    file,
    {},
    { contentType: 'application/octet-stream' }
  );
}

export async function downloadFile(fileChunkId: string): Promise<Uint8Array> {
  const fileChunks: Uint8Array[] = [];

  return new Promise((resolve, reject) => {
    const stream = jezzterBot.getFileStream(fileChunkId);

    stream.on('data', (chunk: Uint8Array) => fileChunks.push(chunk));

    stream.on('error', (error: any) => reject(error));

    stream.on('end', () => {
      const concatenatedBuffer = new Uint8Array(
        fileChunks.reduce((totalLength, chunk) => totalLength + chunk.length, 0)
      );

      let offset = 0;
      fileChunks.forEach(chunk => {
        concatenatedBuffer.set(chunk, offset);
        offset += chunk.length;
      });

      resolve(concatenatedBuffer);
    });
  });
}
