const { format, utcToZonedTime } = require('date-fns-tz')
const isEven = require('is-even')

import { Lesson, localDayOfWeek, lessonsSecondWeek, lessonsFirstWeek } from '../data/lessons'
import { bot } from '../bot'

/* PRODUCT */
export const chatId = process.env.NODE_ENV === 'production' ? process.env.GROUP_CHAT_ID : process.env.TEST_GROUP_CHAT_ID

export const formatLesson = ({ name, time, link, educator, subgroup }: Lesson): string => `
<i><b>Предмет</b>: ${name}
<b>Время</b>: <u>${time}</u>
<b>Ссылка</b>: ${link}
<b>Подгруппа</b>: ${subgroup === 'both' ? '1 и 2' : subgroup}
<b>Преподаватель</b>: ${educator}</i>\n`

export const getCurrentDate = () => {
  const date: Date = utcToZonedTime(new Date(), 'Europe/Kiev')
  const currentWeekOfYear: string = format(date, 'w')
  const currentLocalDay: localDayOfWeek = format(date, 'eeee').toLowerCase()
  const currentTime: string = format(date, 'HH:mm')
  const isDayOff = currentLocalDay === 'sunday' || currentLocalDay === 'saturday'
  const isEvenWeek: boolean = isEven(currentWeekOfYear)
  const currentWeek = isEvenWeek ? `Первая` : `Вторая`

  return { date, currentWeekOfYear, currentLocalDay, currentTime, isEvenWeek, currentWeek, isDayOff }
}

export const getTodayLessons = (): Lesson[] => {
  const { currentLocalDay, isEvenWeek } = getCurrentDate()
  const lessons = isEvenWeek ? lessonsFirstWeek : lessonsSecondWeek
  const currentDayLessons = lessons[currentLocalDay]

  return currentDayLessons
}

export const minutesToFormattedTime = (totalMinutes: number): string => {
  const updatedTimeHours = Math.floor(totalMinutes / 60)
  const updatedTimeMinutes = Math.floor(totalMinutes - updatedTimeHours * 60)
  return `${updatedTimeHours}:${updatedTimeMinutes < 10 ? '0' : ''}${updatedTimeMinutes}`
}

export const formattedTimeToMinutes = (formattedTime: string): number => {
  const [hh, mm] = formattedTime.split(':').map(n => +n)
  return hh * 60 + mm
}

export const addMinutesToFormattedTime = (formattedTime: string, addedMinutes: number): string => {
  const totalMinutes = formattedTimeToMinutes(formattedTime) + addedMinutes
  return minutesToFormattedTime(totalMinutes)
}

export const subtractMinutesFromFormattedTime = (formattedTime: string, substractedMinutes: number): string => {
  const totalMinutes = formattedTimeToMinutes(formattedTime) - substractedMinutes
  return minutesToFormattedTime(totalMinutes)
}

export const getOffsetFromFormattedTimes = (t1: string, t2: string): number => {
  return formattedTimeToMinutes(t1) - formattedTimeToMinutes(t2)
}

export const sendMessage = (message: string, options?: any): void => {
  bot.sendMessage(chatId, message, { parse_mode: 'HTML', ...options })
}

export const sendUsersNotification = (users: string[]): void => {
  const notificatedUsers = users.map(nickname => `<a href="@${nickname}">@${nickname}</a>`).join(' ')
  setTimeout(() => {
    sendMessage(`<i> /* ${notificatedUsers} */ </i>`, { parse_mode: 'HTML' })
  }, 500)
}
