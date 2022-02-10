import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  collapsed: false,
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
  },
});

export const { collapse, expand } = siderSlice.actions;

export default siderSlice.reducer;
