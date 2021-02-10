import { handleActions, checkUpcomingLessons } from './actions'
import { config } from 'dotenv'

const listen = () => {
  config()
  handleActions()
  checkUpcomingLessons()
}

listen()

export {}
