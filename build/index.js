"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("./actions");
var dotenv_1 = require("dotenv");
var listen = function () {
    dotenv_1.config();
    actions_1.handleActions();
    actions_1.checkUpcomingLessons();
};
listen();
