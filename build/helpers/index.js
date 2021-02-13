"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessage = exports.sendMessage = exports.subtractMinutesFromFormattedTime = exports.addMinutesToFormattedTime = exports.minutesToFormattedTime = exports.getTodayLessons = exports.getCurrentDate = exports.formatLesson = exports.chatId = void 0;
var _a = require('date-fns-tz'), format = _a.format, zonedTimeToUtc = _a.zonedTimeToUtc;
var isEven = require('is-even');
var lessons_1 = require("../data/lessons");
var bot_1 = require("../bot");
var date_fns_tz_1 = require("date-fns-tz");
// export const chatId = process.env.NODE_ENV === 'production' ? process.env.GROUP_CHAT_ID : process.env.TEST_GROUP_CHAT_ID
exports.chatId = process.env.TEST_GROUP_CHAT_ID;
var formatLesson = function (_a) {
    var name = _a.name, time = _a.time, link = _a.link, flat = _a.flat, educator = _a.educator;
    return "\n\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435: " + name + "\n\u0412\u0440\u0435\u043C\u044F \u043B\u0435\u043A\u0446\u0438\u0438: " + time + "\n\u0421\u0441\u044B\u043B\u043A\u0430: " + link + "\n\u041A\u0430\u0431\u0438\u043D\u0435\u0442: " + flat + "\n\u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C: " + educator + "\n";
};
exports.formatLesson = formatLesson;
var getCurrentDate = function () {
    var date = date_fns_tz_1.utcToZonedTime(new Date(), 'Europe/Kiev');
    var currentWeekOfYear = format(date, 'w');
    var currentLocalDay = 'monday';
    // const currentLocalDay: localDayOfWeek = format(date, 'eeee').toLowerCase()
    var currentTime = format(date, 'HH:mm');
    var isEvenWeek = isEven(currentWeekOfYear);
    var currentWeek = isEvenWeek ? "\u041F\u0435\u0440\u0432\u0430\u044F" : "\u0412\u0442\u043E\u0440\u0430\u044F";
    return { date: date, currentWeekOfYear: currentWeekOfYear, currentLocalDay: currentLocalDay, currentTime: currentTime, isEvenWeek: isEvenWeek, currentWeek: currentWeek };
};
exports.getCurrentDate = getCurrentDate;
var getTodayLessons = function () {
    var _a = exports.getCurrentDate(), currentLocalDay = _a.currentLocalDay, isEvenWeek = _a.isEvenWeek;
    var lessons = isEvenWeek ? lessons_1.lessonsSecondWeek : lessons_1.lessonsFirstWeek;
    var currentDayLessons = lessons[currentLocalDay];
    return currentDayLessons;
};
exports.getTodayLessons = getTodayLessons;
var minutesToFormattedTime = function (totalMinutes) {
    var updatedTimeHours = Math.floor(totalMinutes / 60);
    var updatedTimeMinutes = Math.floor(totalMinutes - updatedTimeHours * 60) || '00';
    return updatedTimeHours + ":" + updatedTimeMinutes;
};
exports.minutesToFormattedTime = minutesToFormattedTime;
var addMinutesToFormattedTime = function (formattedTime, addedMinutes) {
    var _a = formattedTime.split(':').map(function (n) { return +n; }), hours = _a[0], minutes = _a[1];
    var totalMinutes = hours * 60 + minutes + addedMinutes;
    return exports.minutesToFormattedTime(totalMinutes);
};
exports.addMinutesToFormattedTime = addMinutesToFormattedTime;
var subtractMinutesFromFormattedTime = function (formattedTime, substractedMinutes) {
    var _a = formattedTime.split(':').map(function (n) { return +n; }), hours = _a[0], minutes = _a[1];
    var totalMinutes = hours * 60 + minutes - substractedMinutes;
    return exports.minutesToFormattedTime(totalMinutes);
};
exports.subtractMinutesFromFormattedTime = subtractMinutesFromFormattedTime;
var sendMessage = function (message, options) {
    bot_1.bot.sendMessage(exports.chatId, message, options);
};
exports.sendMessage = sendMessage;
var onMessage = function (callback) {
    bot_1.bot.on('message', function (msg) { return callback(msg); });
};
exports.onMessage = onMessage;
