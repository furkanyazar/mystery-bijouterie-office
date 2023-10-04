export default interface CreatePurchasePriceCommand {
  productId: number;
  totalPrice: number;
  totalQuantity: number;
  purchasedDate: string;
}
