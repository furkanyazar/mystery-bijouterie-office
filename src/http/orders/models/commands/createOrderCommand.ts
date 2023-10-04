export default interface CreateOrderCommand {
  totalAdditionalExpense: number;
  receivedPriceForShipping: number;
  paidPriceForShipping: number;
  orderDate: string;
}
