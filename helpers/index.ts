const { format, zonedTimeToUtc } = require('date-fns-tz')
const isEven = require('is-even')

import { Lesson, localDayOfWeek, lessonsSecondWeek, lessonsFirstWeek } from '../data/lessons'
import { bot } from '../bot'

// export const chatId = process.env.NODE_ENV === 'production' ? process.env.GROUP_CHAT_ID : process.env.TEST_GROUP_CHAT_ID
export const chatId = process.env.TEST_GROUP_CHAT_ID

export const formatLesson = ({ name, time, link, flat, educator }: Lesson): string => `
Название: ${name}
Время лекции: ${time}
Ссылка: ${link}
Кабинет: ${flat}
Преподаватель: ${educator}\n`

export const getCurrentDate = () => {
  const date: Date = zonedTimeToUtc(new Date())
  const currentWeekOfYear: string = format(date, 'w')
  const currentLocalDay: localDayOfWeek = format(date, 'eeee').toLowerCase()
  const currentTime: string = format(date, 'HH:mm')
  const isEvenWeek: boolean = isEven(currentWeekOfYear)
  const currentWeek = isEvenWeek ? `Первая` : `Вторая`

  return { date, currentWeekOfYear, currentLocalDay, currentTime, isEvenWeek, currentWeek }
}

export const getTodayLessons = (): Lesson[] => {
  const { currentLocalDay, isEvenWeek } = getCurrentDate()
  const lessons = isEvenWeek ? lessonsSecondWeek : lessonsFirstWeek
  const currentDayLessons = lessons[currentLocalDay]

  return currentDayLessons
}

export const minutesToFormattedTime = (totalMinutes: number) => {
  const updatedTimeHours = Math.floor(totalMinutes / 60)
  const updatedTimeMinutes = Math.floor(totalMinutes - updatedTimeHours * 60) || '00'
  return `${updatedTimeHours}:${updatedTimeMinutes}`
}

export const addMinutesToFormattedTime = (formattedTime: string, addedMinutes: number) => {
  const [hours, minutes] = formattedTime.split(':').map(n => +n)
  const totalMinutes = hours * 60 + minutes + addedMinutes

  return minutesToFormattedTime(totalMinutes)
}

export const subtractMinutesFromFormattedTime = (formattedTime: string, substractedMinutes: number) => {
  const [hours, minutes] = formattedTime.split(':').map(n => +n)
  const totalMinutes = hours * 60 + minutes - substractedMinutes

  return minutesToFormattedTime(totalMinutes)
}

export const sendMessage = (message: string, options?: any): void => {
  bot.sendMessage(chatId, message, options)
}

export const onMessage = (callback: Function): void => {
  bot.on('message', (msg: any) => callback(msg))
}
