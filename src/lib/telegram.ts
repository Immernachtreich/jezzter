import TelegramBot from 'node-telegram-bot-api';

export const bot = new TelegramBot(process.env.BOT_TOKEN!, { polling: true });
