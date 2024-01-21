import TelegramBot from 'node-telegram-bot-api';

export const jezzterBot = new TelegramBot(process.env.BOT_TOKEN!);
