import { Lesson } from '../data/types'

export enum BotActions {
  currentWeekNumber = '/sch_current_week_number',
  todaySchedular = '/sch_today',
  nextLessonFirstGroup = '/sch_next_lesson_first_group',
  nextLessonSecondGroup = '/sch_next_lesson_second_group',
}

export type CurrentLessonWithOffset = { currentLesson: Lesson | null; currentLessonOffset: number }

export type Groups = 'firstGroup' | 'secondGroup'

export type LiveGroupLessons = {
  [x in Groups]: Lesson
}
