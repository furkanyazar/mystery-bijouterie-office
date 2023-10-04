export default interface UpdatePurchasePriceCommand {
  id: number;
  productId: number;
  totalPrice: number;
  totalQuantity: number;
  purchasedDate: string;
}
