import {
  formatLesson,
  sendMessage,
  onMessage,
  getCurrentDate,
  getTodayLessons,
  subtractMinutesFromFormattedTime,
  sendUsersNotification,
} from '../helpers'
import { Lesson } from '../data/lessons'
import { firstGroupNicknames, secondGroupNicknames } from '../data/users'

export enum Actions {
  currentWeekNumber = '/schedular_current_week_num',
  todaySchedular = '/schedular_today',
  nextLesson = '/schedular_next_lesson',
}

const UPDATE_TIME = 15 * 1000 // 15 seconds

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
      const currentTimeHours = +currentTime.substr(0, 2)
      const lessonTimeHours = +lesson.time.substr(0, 2)

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

type Groups = 'firstGroup' | 'secondGroup'

type CurrentGroupsLessons = {
  [x in Groups]: Lesson
}

export const checkUpcomingLessons = () => {
  const emptyLesson: Lesson = {
    name: '',
    time: '',
    link: '',
    flat: '',
    educator: '',
    subgroup: 'both',
  }

  const currentGroupsLessons: CurrentGroupsLessons = {
    firstGroup: { ...emptyLesson },
    secondGroup: { ...emptyLesson },
  }

  setInterval(() => {
    const { currentTime } = getCurrentDate()
    const todayLessons = getTodayLessons()

    if (todayLessons) {
      todayLessons.map(lesson => {
        const { time: lessonTime } = lesson
        const notificationTime = subtractMinutesFromFormattedTime(lessonTime, 5)

        if (currentTime === notificationTime) {
          if (lesson.subgroup === 1 && currentGroupsLessons.firstGroup.time !== lessonTime) {
            sendMessage(`Через 5 минут пара у первой подгруппы :*\n${formatLesson(lesson)}`)
            sendUsersNotification(firstGroupNicknames)

            currentGroupsLessons.firstGroup = { ...lesson }
          } else if (lesson.subgroup === 2 && currentGroupsLessons.secondGroup.time !== lessonTime) {
            sendMessage(`Через 5 минут пара у второй подгруппы :*\n${formatLesson(lesson)}`)
            sendUsersNotification(secondGroupNicknames)

            currentGroupsLessons.secondGroup = { ...lesson }
          } else if (
            lesson.subgroup === 'both' &&
            currentGroupsLessons.firstGroup.time !== lessonTime &&
            currentGroupsLessons.secondGroup.time !== lessonTime
          ) {
            sendMessage(`Через 5 минут пара у всей группы :*\n${formatLesson(lesson)}`)
            sendUsersNotification(firstGroupNicknames)
            sendUsersNotification(secondGroupNicknames)

            currentGroupsLessons.firstGroup = { ...lesson }
            currentGroupsLessons.secondGroup = { ...lesson }
          }
        }
      })
    }
  }, UPDATE_TIME)
}
