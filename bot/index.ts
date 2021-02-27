import { config } from 'dotenv'
config()

const TelegramBot = require('node-telegram-bot-api')
export const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, { polling: true, autoStart: true })
