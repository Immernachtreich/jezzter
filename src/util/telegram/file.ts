import { jezzterBot } from '@/lib/telegram';

export async function uploadDocument(file: Buffer) {
  const response = await jezzterBot.sendDocument('-4194161484', file);
  console.log(response);
}
