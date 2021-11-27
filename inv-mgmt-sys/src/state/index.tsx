import { configureStore } from '@reduxjs/toolkit';
import siderReducer from './siderSlice';
import renderReducer from './renderSlice';
const store = configureStore({
  reducer: {
    sider: siderReducer,
    renderCount: renderReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch