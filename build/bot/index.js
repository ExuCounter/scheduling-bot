"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
var dotenv_1 = require("dotenv");
var TelegramBot = require('node-telegram-bot-api');
dotenv_1.config();
exports.bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, { polling: true, autoStart: true });
