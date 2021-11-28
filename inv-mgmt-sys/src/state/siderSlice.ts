import { createSlice } from '@reduxjs/toolkit';

interface SiderState {
  collapsed: boolean;
  renderCount: number;
}
const initialState: SiderState = {
  collapsed: false,
  renderCount: 0
};

export const siderSlice = createSlice({
  name: 'isSiderCollapsed',
  initialState,
  reducers: {
    collapse: (state) => {
      state.collapsed = true;
    },
    expand: (state) => {
      state.collapsed = false;
    },
    increment: (state) => {
      state.renderCount++;
    }
  },
});

export const { collapse, expand, increment } = siderSlice.actions;

export default siderSlice.reducer;
