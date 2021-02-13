import {
  formatLesson,
  sendMessage,
  onMessage,
  getCurrentDate,
  getTodayLessons,
  subtractMinutesFromFormattedTime,
} from '../helpers'
import { Lesson } from '../data/lessons'

export enum Actions {
  currentWeekNumber = '/schedular_current_week_num',
  todaySchedular = '/schedular_today',
  nextLesson = '/schedular_next_lesson',
}

const showCurrentWeek = () => {
  const { currentWeek } = getCurrentDate()
  sendMessage(`Текущая неделя по расписанию: ${currentWeek}`)
}

const showTodaySchedular = () => {
  const todayLessons = getTodayLessons()
  const todaySchedular = todayLessons && todayLessons.map(formatLesson)
  if (todaySchedular) {
    sendMessage(`Расписание на сегодня:\n${todaySchedular}`)
  } else {
    sendMessage(`Расписания нету - сегодня выходной.`)
  }
}

const showNextLesson = () => {
  const { currentTime } = getCurrentDate()
  const todayLessons = getTodayLessons()

  const lesson =
    todayLessons &&
    todayLessons.find(lesson => {
      const currentTimeHours = +currentTime.substring(0, 2)
      const lessonTimeHours = +lesson.time.substring(0, 2)
      return lessonTimeHours >= currentTimeHours
    })

  if (lesson) {
    sendMessage(`Следующая пара:${formatLesson(lesson)}`)
  } else {
    sendMessage(`На сегодня пары закончились.`)
  }
}

export const handleActions = () => {
  onMessage((message: any) => {
    const messageText = message.text
    if (messageText.startsWith(Actions.currentWeekNumber)) {
      showCurrentWeek()
    } else if (messageText.startsWith(Actions.todaySchedular)) {
      showTodaySchedular()
    } else if (messageText.startsWith(Actions.nextLesson)) {
      showNextLesson()
    }
  })
}

export const checkUpcomingLessons = () => {
  let currentLesson: Lesson = {
    name: '',
    time: '',
    link: '',
    flat: '',
    educator: '',
  }

  setInterval(() => {
    const { currentTime } = getCurrentDate()
    const todayLessons = getTodayLessons()

    if (todayLessons) {
      todayLessons.map(lesson => {
        const { time: lessonTime } = lesson
        const notificationTime = subtractMinutesFromFormattedTime(lessonTime, 5)
        if (currentTime === notificationTime && currentLesson.time !== lessonTime) {
          sendMessage(`Пара через 5 минут :*\n${formatLesson(lesson)}`)
          currentLesson = { ...lesson }
        }
      })
    }
  }, 15 * 1000)
}
