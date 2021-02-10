import { config } from 'dotenv'
const TelegramBot = require('node-telegram-bot-api')

config()

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, { polling: true, autoStart: true })
