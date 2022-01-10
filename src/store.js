import { configureStore } from '@reduxjs/toolkit';
import calculator from './features/calculator';

export const store = configureStore({
  reducer: calculator,
});
