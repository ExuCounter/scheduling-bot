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
  currentWeekNumber = '/sch_current_week_number',
  todaySchedular = '/sch_today',
  nextLessonFirstGroup = '/sch_next_lesson_first_group',
  nextLessonSecondGroup = '/sch_next_lesson_second_group',
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

const showNextLesson = (subgroup: 1 | 2) => {
  const { currentTime } = getCurrentDate()
  const todayLessons = getTodayLessons()

  const lesson =
    todayLessons &&
    todayLessons
      .filter(lesson => lesson.subgroup === subgroup || lesson.subgroup === 'both')
      .find(lesson => {
        const currentTimeHours = +currentTime.substr(0, 2)
        const lessonTimeHours = +lesson.time.substr(0, 2)

        return lessonTimeHours >= currentTimeHours
      })

  if (lesson) {
    sendMessage(`Следующая пара у ${subgroup === 1 ? 'первой' : 'второй'} подгруппы:\n${formatLesson(lesson)}`)
  } else {
    sendMessage(`На сегодня пары у ${subgroup === 1 ? 'первой' : 'второй'} закончились.`)
  }
}

export const handleActions = () => {
  onMessage((message: any) => {
    const messageText = message.text
    if (messageText.startsWith(Actions.currentWeekNumber)) {
      showCurrentWeek()
    } else if (messageText.startsWith(Actions.todaySchedular)) {
      showTodaySchedular()
    } else if (messageText.startsWith(Actions.nextLessonFirstGroup)) {
      showNextLesson(1)
    } else if (messageText.startsWith(Actions.nextLessonSecondGroup)) {
      showNextLesson(2)
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
