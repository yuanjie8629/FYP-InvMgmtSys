import { createSlice } from '@reduxjs/toolkit';

interface SiderState {
  value: boolean;
}
const initialState: SiderState = {
  value: false,
};

export const siderSlice = createSlice({
  name: 'isSiderCollapsed',
  initialState,
  reducers: {
    collapse: (state) => {
      state.value = true;
    },
    expand: (state) => {
      state.value = false;
    },
  },
});

export const { collapse, expand } = siderSlice.actions;

export default siderSlice.reducer;
