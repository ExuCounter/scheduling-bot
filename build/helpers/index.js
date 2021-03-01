"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUsersNotification = exports.sendMessage = exports.getOffsetFromFormattedTimes = exports.subtractMinutesFromFormattedTime = exports.addMinutesToFormattedTime = exports.formattedTimeToMinutes = exports.minutesToFormattedTime = exports.getTodayLessons = exports.getCurrentDate = exports.formatLesson = exports.chatId = void 0;
var _a = require('date-fns-tz'), format = _a.format, utcToZonedTime = _a.utcToZonedTime;
var isEven = require('is-even');
var lessons_1 = require("../data/lessons");
var bot_1 = require("../bot");
/* PRODUCT */
exports.chatId = process.env.NODE_ENV === 'production' ? process.env.GROUP_CHAT_ID : process.env.TEST_GROUP_CHAT_ID;
var formatLesson = function (_a) {
    var name = _a.name, time = _a.time, link = _a.link, educator = _a.educator, subgroup = _a.subgroup;
    return "\n<i><b>\u041F\u0440\u0435\u0434\u043C\u0435\u0442</b>: " + name + "\n<b>\u0412\u0440\u0435\u043C\u044F</b>: <u>" + time + "</u>\n<b>\u0421\u0441\u044B\u043B\u043A\u0430</b>: " + link + "\n<b>\u041F\u043E\u0434\u0433\u0440\u0443\u043F\u043F\u0430</b>: " + (subgroup === 'both' ? '1 и 2' : subgroup) + "\n<b>\u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C</b>: " + educator + "</i>\n";
};
exports.formatLesson = formatLesson;
var getCurrentDate = function () {
    var date = utcToZonedTime(new Date(), 'Europe/Kiev');
    var currentWeekOfYear = format(date, 'w');
    var currentLocalDay = format(date, 'eeee').toLowerCase();
    var currentTime = format(date, 'HH:mm');
    var isDayOff = currentLocalDay === 'sunday' || currentLocalDay === 'saturday';
    var isEvenWeek = isEven(currentWeekOfYear);
    var currentWeek = isEvenWeek ? "\u041F\u0435\u0440\u0432\u0430\u044F" : "\u0412\u0442\u043E\u0440\u0430\u044F";
    return { date: date, currentWeekOfYear: currentWeekOfYear, currentLocalDay: currentLocalDay, currentTime: currentTime, isEvenWeek: isEvenWeek, currentWeek: currentWeek, isDayOff: isDayOff };
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
    bot_1.bot.sendMessage(exports.chatId, message, __assign({ parse_mode: 'HTML' }, options));
};
exports.sendMessage = sendMessage;
var sendUsersNotification = function (users) {
    var notificatedUsers = users.map(function (nickname) { return "<a href=\"@" + nickname + "\">@" + nickname + "</a>"; }).join(' ');
    setTimeout(function () {
        exports.sendMessage("<i> /* " + notificatedUsers + " */ </i>", { parse_mode: 'HTML' });
    }, 500);
};
exports.sendUsersNotification = sendUsersNotification;
