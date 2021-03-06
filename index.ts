import { Schedular } from './schedular'
import { lessonsData } from './data/lessons'

const schedular = new Schedular(lessonsData)
schedular.checkUpcomingLessons()
schedular.handleActions()
