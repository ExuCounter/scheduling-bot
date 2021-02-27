"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
var dotenv_1 = require("dotenv");
dotenv_1.config();
var TelegramBot = require('node-telegram-bot-api');
exports.bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, { polling: true, autoStart: true });
