import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import GetByIdUserResponse from "../../http/users/models/responses/getByIdUserResponse";
import { userItems } from "../models/userItems";

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
