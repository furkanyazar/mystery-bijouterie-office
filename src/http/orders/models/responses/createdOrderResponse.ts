export default interface CreatedOrderResponse {
  id: number;
  totalAdditionalExpense: number;
  receivedPriceForShipping: number;
  paidPriceForShipping: number;
  orderDate: string;
}
