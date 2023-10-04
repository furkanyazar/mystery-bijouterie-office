export default interface UpdatedOrderResponse {
  id: number;
  totalAdditionalExpense: number;
  receivedPriceForShipping: number;
  paidPriceForShipping: number;
  orderDate: string;
}
