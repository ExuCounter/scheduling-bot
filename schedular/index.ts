import {
  formatLesson,
  sendMessage,
  getCurrentDate,
  getTodayLessons,
  subtractMinutesFromFormattedTime,
  sendUsersNotification,
  getOffsetFromFormattedTimes,
} from '../helpers'
import { bot } from '../bot'
import { Lesson, SubGroup, SchedularLessons } from '../data/types'
import { BotActions, CurrentLessonWithOffset, LiveGroupLessons } from './types'
import { firstGroupNicknames, secondGroupNicknames } from '../data/users'

export class Schedular {
  private UPDATE_TIMEOUT: number = 15 * 1000 // 15 seconds
  private MORNING_NOTIFICATION_TIME = '10:00' // Morning notification time
  private schedularLessons: SchedularLessons
  private emptyLesson: Lesson = {
    name: '',
    time: '',
    link: '',
    flat: '',
    educator: '',
    subgroup: 'both',
  }
  private liveGroupLessons: LiveGroupLessons = {
    firstGroup: { ...this.emptyLesson },
    secondGroup: { ...this.emptyLesson },
  }
  private isMorningNotificated = false

  constructor(data: SchedularLessons) {
    this.schedularLessons = data
  }

  private showCurrentWeek() {
    const { currentWeek } = getCurrentDate()
    sendMessage(`<i>Текущая неделя по расписанию:\n<b>${currentWeek}</b></i>`)
  }

  private showTodaySchedular = () => {
    const todayLessons = getTodayLessons(this.schedularLessons)
    const todaySchedular = todayLessons && todayLessons.map(formatLesson).join(' ')

    if (todaySchedular.length > 0) {
      sendMessage(`<i><b>Расписание на сегодня:</b></i>\n${todaySchedular}`)
    } else {
      sendMessage(`<i><b>Расписания нету - сегодня выходной.</b></i>`)
    }
  }

  private showNextLesson(subgroup: SubGroup) {
    const { currentTime } = getCurrentDate()
    const todayLessons = getTodayLessons(this.schedularLessons)
    const groupName = subgroup === 1 ? 'первой' : 'второй'

    const data = todayLessons
      .filter(lesson => lesson.subgroup === subgroup || lesson.subgroup === 'both')
      .reduce(
        (acc, lesson) => {
          const offsetInMinutes = getOffsetFromFormattedTimes(lesson.time, currentTime)

          if ((acc.currentLessonOffset === 0 || offsetInMinutes < acc.currentLessonOffset) && offsetInMinutes >= 0) {
            return { currentLesson: lesson, currentLessonOffset: offsetInMinutes }
          }
          return acc
        },
        <CurrentLessonWithOffset>{
          currentLesson: null,
          currentLessonOffset: 0,
        }
      )

    if (data.currentLesson) {
      sendMessage(`<i>Следующая пара у <b><u>${groupName}</u></b> подгруппы:</i>\n${formatLesson(data.currentLesson)}`)
    } else {
      sendMessage(`<i>На сегодня пары у <b><u>${groupName}</u></b> подгруппы закончились.</i>`)
    }
  }

  public handleActions() {
    bot.on('message', (message: any) => {
      const messageText = message.text
      if (messageText.startsWith(BotActions.currentWeekNumber)) {
        this.showCurrentWeek()
      } else if (messageText.startsWith(BotActions.todaySchedular)) {
        this.showTodaySchedular()
      } else if (messageText.startsWith(BotActions.nextLessonFirstGroup)) {
        this.showNextLesson(1)
      } else if (messageText.startsWith(BotActions.nextLessonSecondGroup)) {
        this.showNextLesson(2)
      }
    })
  }

  public checkUpcomingLessons = () => {
    setInterval(() => {
      const { currentTime } = getCurrentDate()
      const todayLessons = getTodayLessons(this.schedularLessons)

      todayLessons.map(lesson => {
        const { time: lessonTime } = lesson
        const notificationTime = subtractMinutesFromFormattedTime(lessonTime, 5)

        if (currentTime === notificationTime) {
          if (lesson.subgroup === 1 && this.liveGroupLessons.firstGroup.time !== lessonTime) {
            setTimeout(() => {
              sendMessage(`<i>Через 5 минут пара у <b><u>первой</u></b> подгруппы</i> \n${formatLesson(lesson)}`)
              sendUsersNotification(firstGroupNicknames)

              this.liveGroupLessons.firstGroup = { ...lesson }
            }, 2000)
          } else if (lesson.subgroup === 2 && this.liveGroupLessons.secondGroup.time !== lessonTime) {
            setTimeout(() => {
              sendMessage(`<i>Через 5 минут пара у <b><u>второй</u></b> подгруппы</i> \n${formatLesson(lesson)}`)
              sendUsersNotification(secondGroupNicknames)

              this.liveGroupLessons.secondGroup = { ...lesson }
            }, 5000)
          } else if (
            lesson.subgroup === 'both' &&
            this.liveGroupLessons.firstGroup.time !== lessonTime &&
            this.liveGroupLessons.secondGroup.time !== lessonTime
          ) {
            sendMessage(`<i>Через 5 минут пара у <b><u>всей</u></b> группы</i> \n${formatLesson(lesson)}`)
            sendUsersNotification(firstGroupNicknames)
            sendUsersNotification(secondGroupNicknames)

            this.liveGroupLessons.firstGroup = { ...lesson }
            this.liveGroupLessons.secondGroup = { ...lesson }
          }
        }
        if (currentTime === this.MORNING_NOTIFICATION_TIME && !this.isMorningNotificated) {
          this.showTodaySchedular()
          this.isMorningNotificated = true
        }
      })
    }, this.UPDATE_TIMEOUT)
  }
}
