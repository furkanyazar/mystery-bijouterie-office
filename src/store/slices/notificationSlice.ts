import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISetNotification, notificationItems } from "../models/notificationItems";

export const notificationSlice = createSlice({
  name: "notification",
  initialState: notificationItems,
  reducers: {
    hideNotification: (state) => {
      state.show = false;
    },
    showNotification: (state, action: PayloadAction<ISetNotification>) => {
      state.show = action.payload.show;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.closable = action.payload.closable;
      state.buttons = action.payload.buttons;
    },
    setButtonLoading: (state, action: PayloadAction<string>) => {
      const button = state.buttons.find((c) => c.key === action.payload);
      button.disabled = true;
      button.loading = true;
      state.closable = false;
    },
    setButtonDisabled: (state, action: PayloadAction<string>) => {
      const button = state.buttons.find((c) => c.key === action.payload);
      button.disabled = true;
    },
    setButtonNotLoading: (state, action: PayloadAction<string>) => {
      const button = state.buttons.find((c) => c.key === action.payload);
      button.disabled = false;
      button.loading = false;
      state.closable = true;
    },
    setButtonNotDisabled: (state, action: PayloadAction<string>) => {
      const button = state.buttons.find((c) => c.key === action.payload);
      button.disabled = false;
    },
  },
});

export const { hideNotification, showNotification, setButtonLoading, setButtonDisabled, setButtonNotLoading, setButtonNotDisabled } =
  notificationSlice.actions;

export default notificationSlice.reducer;
