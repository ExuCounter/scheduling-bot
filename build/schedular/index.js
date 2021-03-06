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
exports.Schedular = void 0;
var helpers_1 = require("../helpers");
var bot_1 = require("../bot");
var types_1 = require("./types");
var users_1 = require("../data/users");
var Schedular = /** @class */ (function () {
    function Schedular(data) {
        var _this = this;
        this.UPDATE_TIMEOUT = 15 * 1000; // 15 seconds
        this.MORNING_NOTIFICATION_TIME = '10:00'; // Morning notification time
        this.emptyLesson = {
            name: '',
            time: '',
            link: '',
            flat: '',
            educator: '',
            subgroup: 'both',
        };
        this.liveGroupLessons = {
            firstGroup: __assign({}, this.emptyLesson),
            secondGroup: __assign({}, this.emptyLesson),
        };
        this.isMorningNotificated = false;
        this.showTodaySchedular = function () {
            var todayLessons = helpers_1.getTodayLessons(_this.schedularLessons);
            var todaySchedular = todayLessons && todayLessons.map(helpers_1.formatLesson).join(' ');
            if (todaySchedular.length > 0) {
                helpers_1.sendMessage("<i><b>\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F:</b></i>\n" + todaySchedular);
            }
            else {
                helpers_1.sendMessage("<i><b>\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043D\u0435\u0442\u0443 - \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0432\u044B\u0445\u043E\u0434\u043D\u043E\u0439.</b></i>");
            }
        };
        this.checkUpcomingLessons = function () {
            setInterval(function () {
                var currentTime = helpers_1.getCurrentDate().currentTime;
                var todayLessons = helpers_1.getTodayLessons(_this.schedularLessons);
                todayLessons.map(function (lesson) {
                    var lessonTime = lesson.time;
                    var notificationTime = helpers_1.subtractMinutesFromFormattedTime(lessonTime, 5);
                    if (currentTime === notificationTime) {
                        if (lesson.subgroup === 1 && _this.liveGroupLessons.firstGroup.time !== lessonTime) {
                            setTimeout(function () {
                                helpers_1.sendMessage("<i>\u0427\u0435\u0440\u0435\u0437 5 \u043C\u0438\u043D\u0443\u0442 \u043F\u0430\u0440\u0430 \u0443 <b><u>\u043F\u0435\u0440\u0432\u043E\u0439</u></b> \u043F\u043E\u0434\u0433\u0440\u0443\u043F\u043F\u044B</i> \n" + helpers_1.formatLesson(lesson));
                                helpers_1.sendUsersNotification(users_1.firstGroupNicknames);
                                _this.liveGroupLessons.firstGroup = __assign({}, lesson);
                            }, 2000);
                        }
                        else if (lesson.subgroup === 2 && _this.liveGroupLessons.secondGroup.time !== lessonTime) {
                            setTimeout(function () {
                                helpers_1.sendMessage("<i>\u0427\u0435\u0440\u0435\u0437 5 \u043C\u0438\u043D\u0443\u0442 \u043F\u0430\u0440\u0430 \u0443 <b><u>\u0432\u0442\u043E\u0440\u043E\u0439</u></b> \u043F\u043E\u0434\u0433\u0440\u0443\u043F\u043F\u044B</i> \n" + helpers_1.formatLesson(lesson));
                                helpers_1.sendUsersNotification(users_1.secondGroupNicknames);
                                _this.liveGroupLessons.secondGroup = __assign({}, lesson);
                            }, 5000);
                        }
                        else if (lesson.subgroup === 'both' &&
                            _this.liveGroupLessons.firstGroup.time !== lessonTime &&
                            _this.liveGroupLessons.secondGroup.time !== lessonTime) {
                            helpers_1.sendMessage("<i>\u0427\u0435\u0440\u0435\u0437 5 \u043C\u0438\u043D\u0443\u0442 \u043F\u0430\u0440\u0430 \u0443 <b><u>\u0432\u0441\u0435\u0439</u></b> \u0433\u0440\u0443\u043F\u043F\u044B</i> \n" + helpers_1.formatLesson(lesson));
                            helpers_1.sendUsersNotification(users_1.firstGroupNicknames);
                            helpers_1.sendUsersNotification(users_1.secondGroupNicknames);
                            _this.liveGroupLessons.firstGroup = __assign({}, lesson);
                            _this.liveGroupLessons.secondGroup = __assign({}, lesson);
                        }
                    }
                    if (currentTime === _this.MORNING_NOTIFICATION_TIME && !_this.isMorningNotificated) {
                        _this.showTodaySchedular();
                        _this.isMorningNotificated = true;
                    }
                });
            }, _this.UPDATE_TIMEOUT);
        };
        this.schedularLessons = data;
    }
    Schedular.prototype.showCurrentWeek = function () {
        var currentWeek = helpers_1.getCurrentDate().currentWeek;
        helpers_1.sendMessage("<i>\u0422\u0435\u043A\u0443\u0449\u0430\u044F \u043D\u0435\u0434\u0435\u043B\u044F \u043F\u043E \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044E:\n<b>" + currentWeek + "</b></i>");
    };
    Schedular.prototype.showNextLesson = function (subgroup) {
        var currentTime = helpers_1.getCurrentDate().currentTime;
        var todayLessons = helpers_1.getTodayLessons(this.schedularLessons);
        var groupName = subgroup === 1 ? 'первой' : 'второй';
        var data = todayLessons
            .filter(function (lesson) { return lesson.subgroup === subgroup || lesson.subgroup === 'both'; })
            .reduce(function (acc, lesson) {
            var offsetInMinutes = helpers_1.getOffsetFromFormattedTimes(lesson.time, currentTime);
            if ((acc.currentLessonOffset === 0 || offsetInMinutes < acc.currentLessonOffset) && offsetInMinutes >= 0) {
                return { currentLesson: lesson, currentLessonOffset: offsetInMinutes };
            }
            return acc;
        }, {
            currentLesson: null,
            currentLessonOffset: 0,
        });
        if (data.currentLesson) {
            helpers_1.sendMessage("<i>\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u043F\u0430\u0440\u0430 \u0443 <b><u>" + groupName + "</u></b> \u043F\u043E\u0434\u0433\u0440\u0443\u043F\u043F\u044B:</i>\n" + helpers_1.formatLesson(data.currentLesson));
        }
        else {
            helpers_1.sendMessage("<i>\u041D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043F\u0430\u0440\u044B \u0443 <b><u>" + groupName + "</u></b> \u043F\u043E\u0434\u0433\u0440\u0443\u043F\u043F\u044B \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u043B\u0438\u0441\u044C.</i>");
        }
    };
    Schedular.prototype.handleActions = function () {
        var _this = this;
        bot_1.bot.on('message', function (message) {
            var messageText = message.text;
            if (messageText.startsWith(types_1.BotActions.currentWeekNumber)) {
                _this.showCurrentWeek();
            }
            else if (messageText.startsWith(types_1.BotActions.todaySchedular)) {
                _this.showTodaySchedular();
            }
            else if (messageText.startsWith(types_1.BotActions.nextLessonFirstGroup)) {
                _this.showNextLesson(1);
            }
            else if (messageText.startsWith(types_1.BotActions.nextLessonSecondGroup)) {
                _this.showNextLesson(2);
            }
        });
    };
    return Schedular;
}());
exports.Schedular = Schedular;
