export type Lesson = {
  name: string
  time: string
  link: string
  flat: string
  educator: string
  subgroup: SubGroup
}

export type localDayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type SubGroup = 1 | 2 | 'both'

export type Schedular = {
  [key in localDayOfWeek]: Lesson[]
}

export type Users = string[]
