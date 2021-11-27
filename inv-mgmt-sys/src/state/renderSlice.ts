import { createSlice } from '@reduxjs/toolkit';

interface RenderState {
  value: number;
}
const initialState: RenderState = {
  value: 0,
};

export const renderSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    increment: (state) => {
      state.value++;
    }
  },
});

export const { increment } = renderSlice.actions;

export default renderSlice.reducer;
