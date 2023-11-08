import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { userItems } from "../models/userItems";
import GetByIdUserResponse from "../../http/users/models/queries/getByIdUserResponse";

export const userSlice = createSlice({
  name: "user",
  initialState: userItems,
  reducers: {
    setUser: (state, action: PayloadAction<GetByIdUserResponse>) => {
      state.user = action.payload ?? null;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
