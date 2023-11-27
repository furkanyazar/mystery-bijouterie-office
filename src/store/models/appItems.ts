export const discountItems: IAppItems = {
  discounts: [{ id: 1, amount: 10, type: "amount" }],
  lastDiscountId: 1,
};

export interface IAppItems {
  discounts: DiscountItemDto[];
  lastDiscountId: number;
}

export interface DiscountItemDto {
  id: number;
  type: "amount" | "percent";
  amount: number;
}
