import { configureStore } from '@reduxjs/toolkit';
import siderReducer from './siderSlice';
const store = configureStore({
  reducer: {
    sider: siderReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
