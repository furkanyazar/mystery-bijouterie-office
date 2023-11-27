import { combineReducers } from "redux";
import appSlice from "./slices/appSlice";
import notificationSlice from "./slices/notificationSlice";
import userSlice from "./slices/userSlice";

export const reducers = combineReducers({
  userItems: userSlice,
  notificationItems: notificationSlice,
  appItems: appSlice,
});
