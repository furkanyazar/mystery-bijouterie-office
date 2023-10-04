export default interface UpdateOrderCommand {
  id: number;
  totalAdditionalExpense: number;
  receivedPriceForShipping: number;
  paidPriceForShipping: number;
  orderDate: string;
}
