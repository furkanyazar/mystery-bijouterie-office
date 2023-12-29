import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DiscountItemDto, discountItems } from "../models/appItems";

export const appSlice = createSlice({
  name: "discount",
  initialState: discountItems,
  reducers: {
    addDiscount: (state, action: PayloadAction<AddDiscountItemDto>) => {
      state.lastDiscountId++;
      state.discounts.push({ id: state.lastDiscountId, amount: action.payload.amount, type: action.payload.type });
    },
    updateDiscount: (state, action: PayloadAction<DiscountItemDto>) => {
      const discount = state.discounts.find((c) => c.id === action.payload.id);
      discount.amount = action.payload.amount;
      discount.type = action.payload.type;
    },
    removeDiscount: (state, action: PayloadAction<number>) => {
      state.discounts = state.discounts.filter((c) => c.id !== action.payload);
    },
  },
});

export const { addDiscount, updateDiscount, removeDiscount } = appSlice.actions;

export default appSlice.reducer;

export interface AddDiscountItemDto {
  type: "amount" | "percent";
  amount: number;
}
