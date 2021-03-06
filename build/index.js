"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schedular_1 = require("./schedular");
var lessons_1 = require("./data/lessons");
var schedular = new schedular_1.Schedular(lessons_1.lessonsData);
schedular.checkUpcomingLessons();
schedular.handleActions();
