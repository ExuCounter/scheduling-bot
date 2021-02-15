"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessage = exports.sendUsersNotification = exports.sendMessage = exports.getOffsetFromFormattedTimes = exports.subtractMinutesFromFormattedTime = exports.addMinutesToFormattedTime = exports.formattedTimeToMinutes = exports.minutesToFormattedTime = exports.getTodayLessons = exports.getCurrentDate = exports.formatLesson = exports.chatId = void 0;
var _a = require('date-fns-tz'), format = _a.format, utcToZonedTime = _a.utcToZonedTime;
var isEven = require('is-even');
var lessons_1 = require("../data/lessons");
var bot_1 = require("../bot");
/* PRODUCT */
exports.chatId = process.env.NODE_ENV === 'production' ? process.env.GROUP_CHAT_ID : process.env.TEST_GROUP_CHAT_ID;
/* DEV */
// export const chatId = process.env.TEST_GROUP_CHAT_ID
var formatLesson = function (_a) {
    var name = _a.name, time = _a.time, link = _a.link, educator = _a.educator, subgroup = _a.subgroup;
    return "\n\u041F\u0440\u0435\u0434\u043C\u0435\u0442: " + name + "\n\u0412\u0440\u0435\u043C\u044F: " + time + "\n\u0421\u0441\u044B\u043B\u043A\u0430: " + link + "\n\u041F\u043E\u0434\u0433\u0440\u0443\u043F\u043F\u0430: " + (subgroup === 'both' ? '1 и 2' : subgroup) + "\n\u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C: " + educator + "\n";
};
exports.formatLesson = formatLesson;
var getCurrentDate = function () {
    var date = utcToZonedTime(new Date(), 'Europe/Kiev');
    var currentWeekOfYear = format(date, 'w');
    var currentLocalDay = format(date, 'eeee').toLowerCase();
    var currentTime = format(date, 'HH:mm');
    var isEvenWeek = isEven(currentWeekOfYear);
    var currentWeek = isEvenWeek ? "\u041F\u0435\u0440\u0432\u0430\u044F" : "\u0412\u0442\u043E\u0440\u0430\u044F";
    return { date: date, currentWeekOfYear: currentWeekOfYear, currentLocalDay: currentLocalDay, currentTime: currentTime, isEvenWeek: isEvenWeek, currentWeek: currentWeek };
};
exports.getCurrentDate = getCurrentDate;
var getTodayLessons = function () {
    var _a = exports.getCurrentDate(), currentLocalDay = _a.currentLocalDay, isEvenWeek = _a.isEvenWeek;
    var lessons = isEvenWeek ? lessons_1.lessonsFirstWeek : lessons_1.lessonsSecondWeek;
    var currentDayLessons = lessons[currentLocalDay];
    return currentDayLessons;
};
exports.getTodayLessons = getTodayLessons;
var minutesToFormattedTime = function (totalMinutes) {
    var updatedTimeHours = Math.floor(totalMinutes / 60);
    var updatedTimeMinutes = Math.floor(totalMinutes - updatedTimeHours * 60);
    return updatedTimeHours + ":" + (updatedTimeMinutes < 10 ? '0' : '') + updatedTimeMinutes;
};
exports.minutesToFormattedTime = minutesToFormattedTime;
var formattedTimeToMinutes = function (formattedTime) {
    var _a = formattedTime.split(':').map(function (n) { return +n; }), hh = _a[0], mm = _a[1];
    return hh * 60 + mm;
};
exports.formattedTimeToMinutes = formattedTimeToMinutes;
var addMinutesToFormattedTime = function (formattedTime, addedMinutes) {
    var totalMinutes = exports.formattedTimeToMinutes(formattedTime) + addedMinutes;
    return exports.minutesToFormattedTime(totalMinutes);
};
exports.addMinutesToFormattedTime = addMinutesToFormattedTime;
var subtractMinutesFromFormattedTime = function (formattedTime, substractedMinutes) {
    var totalMinutes = exports.formattedTimeToMinutes(formattedTime) - substractedMinutes;
    return exports.minutesToFormattedTime(totalMinutes);
};
exports.subtractMinutesFromFormattedTime = subtractMinutesFromFormattedTime;
var getOffsetFromFormattedTimes = function (t1, t2) {
    return exports.formattedTimeToMinutes(t1) - exports.formattedTimeToMinutes(t2);
};
exports.getOffsetFromFormattedTimes = getOffsetFromFormattedTimes;
var sendMessage = function (message, options) {
    bot_1.bot.sendMessage(exports.chatId, message, options);
};
exports.sendMessage = sendMessage;
var sendUsersNotification = function (users) {
    var notificatedUsers = users.map(function (nickname) { return "<a href=\"@" + nickname + "\">@" + nickname + "</a>"; });
    setTimeout(function () {
        exports.sendMessage("" + notificatedUsers, { parse_mode: 'HTML' });
    }, 150);
};
exports.sendUsersNotification = sendUsersNotification;
var onMessage = function (callback) {
    bot_1.bot.on('message', function (msg) { return callback(msg); });
};
exports.onMessage = onMessage;
