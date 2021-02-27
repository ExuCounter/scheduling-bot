import { Lesson } from '../data/lessons'

export enum Actions {
  currentWeekNumber = '/sch_current_week_number',
  todaySchedular = '/sch_today',
  nextLessonFirstGroup = '/sch_next_lesson_first_group',
  nextLessonSecondGroup = '/sch_next_lesson_second_group',
}

export type CurrentLessonWithOffset = { currentLesson: Lesson | null; currentLessonOffset: number }

export type Groups = 'firstGroup' | 'secondGroup'

export type CurrentGroupsLessons = {
  [x in Groups]: Lesson
}
