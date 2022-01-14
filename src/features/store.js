import { configureStore } from '@reduxjs/toolkit'
// import logger from 'redux-logger'
import calculator from './calculator'

export const store = configureStore({
  reducer: calculator
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(logger)
})
