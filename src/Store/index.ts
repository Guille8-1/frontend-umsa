import { createSlice } from "@reduxjs/toolkit";

const valueSlice = createSlice({
  name: "value",
  initialState: {
    value: "Initial value",
    eventId: 0
  },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload;
    },
    triggerEvent: (state) => {
      state.eventId += 1;
    },
    resetStatus: (state) => {
      state.value = 'idle';
    }
  },
});

export const { setValue, resetStatus, triggerEvent } = valueSlice.actions;
export const valueReducer = valueSlice.reducer;
