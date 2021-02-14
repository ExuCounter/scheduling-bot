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
exports.checkUpcomingLessons = exports.handleActions = exports.Actions = void 0;
var helpers_1 = require("../helpers");
var users_1 = require("../data/users");
var Actions;
(function (Actions) {
    Actions["currentWeekNumber"] = "/sch_current_week_number";
    Actions["todaySchedular"] = "/sch_today";
    Actions["nextLessonFirstGroup"] = "/sch_next_lesson_first_group";
    Actions["nextLessonSecondGroup"] = "/sch_next_lesson_second_group";
})(Actions = exports.Actions || (exports.Actions = {}));
var UPDATE_TIME = 15 * 1000; // 15 seconds
var showCurrentWeek = function () {
    var currentWeek = helpers_1.getCurrentDate().currentWeek;
    helpers_1.sendMessage("\u0422\u0435\u043A\u0443\u0449\u0430\u044F \u043D\u0435\u0434\u0435\u043B\u044F \u043F\u043E \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044E: " + currentWeek);
};
var showTodaySchedular = function () {
    var todayLessons = helpers_1.getTodayLessons();
    var todaySchedular = todayLessons && todayLessons.map(helpers_1.formatLesson);
    if (todaySchedular) {
        helpers_1.sendMessage("\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F:\n" + todaySchedular);
    }
    else {
        helpers_1.sendMessage("\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043D\u0435\u0442\u0443 - \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0432\u044B\u0445\u043E\u0434\u043D\u043E\u0439.");
    }
};
var showNextLesson = function (subgroup) {
    var currentTime = helpers_1.getCurrentDate().currentTime;
    var todayLessons = helpers_1.getTodayLessons();
    var subgroupLessons = todayLessons && todayLessons.filter(function (lesson) { return lesson.subgroup === subgroup || lesson.subgroup === 'both'; });
    var nextSubgroupLesson = (function () {
        var currentLesson = null;
        var currentLessonOffsetInMinutes = 0;
        subgroupLessons.forEach(function (lesson) {
            var offsetInMinutes = helpers_1.getOffsetFromFormattedTimes(lesson.time, currentTime);
            if ((currentLessonOffsetInMinutes === 0 || offsetInMinutes < currentLessonOffsetInMinutes) &&
                offsetInMinutes >= 0) {
                currentLessonOffsetInMinutes = offsetInMinutes;
                currentLesson = __assign({}, lesson);
            }
        });
        return currentLesson;
    })();
    if (nextSubgroupLesson) {
        helpers_1.sendMessage("\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u043F\u0430\u0440\u0430 \u0443 " + (subgroup === 1 ? 'первой' : 'второй') + " \u043F\u043E\u0434\u0433\u0440\u0443\u043F\u043F\u044B:\n" + helpers_1.formatLesson(nextSubgroupLesson));
    }
    else {
        helpers_1.sendMessage("\u041D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043F\u0430\u0440\u044B \u0443 " + (subgroup === 1 ? 'первой' : 'второй') + " \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u043B\u0438\u0441\u044C.");
    }
};
var handleActions = function () {
    helpers_1.onMessage(function (message) {
        var messageText = message.text;
        if (messageText.startsWith(Actions.currentWeekNumber)) {
            showCurrentWeek();
        }
        else if (messageText.startsWith(Actions.todaySchedular)) {
            showTodaySchedular();
        }
        else if (messageText.startsWith(Actions.nextLessonFirstGroup)) {
            showNextLesson(1);
        }
        else if (messageText.startsWith(Actions.nextLessonSecondGroup)) {
            showNextLesson(2);
        }
    });
};
exports.handleActions = handleActions;
var checkUpcomingLessons = function () {
    var emptyLesson = {
        name: '',
        time: '',
        link: '',
        flat: '',
        educator: '',
        subgroup: 'both',
    };
    var currentGroupsLessons = {
        firstGroup: __assign({}, emptyLesson),
        secondGroup: __assign({}, emptyLesson),
    };
    setInterval(function () {
        var currentTime = helpers_1.getCurrentDate().currentTime;
        var todayLessons = helpers_1.getTodayLessons();
        if (todayLessons) {
            todayLessons.map(function (lesson) {
                var lessonTime = lesson.time;
                var notificationTime = helpers_1.subtractMinutesFromFormattedTime(lessonTime, 5);
                if (currentTime === notificationTime) {
                    if (lesson.subgroup === 1 && currentGroupsLessons.firstGroup.time !== lessonTime) {
                        helpers_1.sendMessage("\u0427\u0435\u0440\u0435\u0437 5 \u043C\u0438\u043D\u0443\u0442 \u043F\u0430\u0440\u0430 \u0443 \u043F\u0435\u0440\u0432\u043E\u0439 \u043F\u043E\u0434\u0433\u0440\u0443\u043F\u043F\u044B :*\n" + helpers_1.formatLesson(lesson));
                        helpers_1.sendUsersNotification(users_1.firstGroupNicknames);
                        currentGroupsLessons.firstGroup = __assign({}, lesson);
                    }
                    else if (lesson.subgroup === 2 && currentGroupsLessons.secondGroup.time !== lessonTime) {
                        helpers_1.sendMessage("\u0427\u0435\u0440\u0435\u0437 5 \u043C\u0438\u043D\u0443\u0442 \u043F\u0430\u0440\u0430 \u0443 \u0432\u0442\u043E\u0440\u043E\u0439 \u043F\u043E\u0434\u0433\u0440\u0443\u043F\u043F\u044B :*\n" + helpers_1.formatLesson(lesson));
                        helpers_1.sendUsersNotification(users_1.secondGroupNicknames);
                        currentGroupsLessons.secondGroup = __assign({}, lesson);
                    }
                    else if (lesson.subgroup === 'both' &&
                        currentGroupsLessons.firstGroup.time !== lessonTime &&
                        currentGroupsLessons.secondGroup.time !== lessonTime) {
                        helpers_1.sendMessage("\u0427\u0435\u0440\u0435\u0437 5 \u043C\u0438\u043D\u0443\u0442 \u043F\u0430\u0440\u0430 \u0443 \u0432\u0441\u0435\u0439 \u0433\u0440\u0443\u043F\u043F\u044B :*\n" + helpers_1.formatLesson(lesson));
                        helpers_1.sendUsersNotification(users_1.firstGroupNicknames);
                        helpers_1.sendUsersNotification(users_1.secondGroupNicknames);
                        currentGroupsLessons.firstGroup = __assign({}, lesson);
                        currentGroupsLessons.secondGroup = __assign({}, lesson);
                    }
                }
            });
        }
    }, UPDATE_TIME);
};
exports.checkUpcomingLessons = checkUpcomingLessons;
