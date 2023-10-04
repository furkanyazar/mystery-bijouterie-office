export default interface DeletedOrderResponse {
  id: number;
  totalAdditionalExpense: number;
  receivedPriceForShipping: number;
  paidPriceForShipping: number;
  orderDate: string;
}
