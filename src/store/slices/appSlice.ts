import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appItems, ISetListItem } from "../models/appItems";

export const appSlice = createSlice({
  name: "app",
  initialState: appItems,
  reducers: {
    setListItem: (state, action: PayloadAction<ISetListItem>) => {
      state[action.payload.listName] = action.payload.stateValue;
    },
  },
});

export const { setListItem } = appSlice.actions;

export default appSlice.reducer;
