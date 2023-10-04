import { faSpinner } from "@fortawesome/free-solid-svg-icons";
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
      button.text = "";
      button.icon = faSpinner;
      state.closable = false;
    },
    setButtonDisabled: (state, action: PayloadAction<string>) => {
      const button = state.buttons.find((c) => c.key === action.payload);
      button.disabled = true;
    },
  },
});

export const { hideNotification, showNotification, setButtonLoading, setButtonDisabled } = notificationSlice.actions;

export default notificationSlice.reducer;
