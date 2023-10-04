export default interface GetListPurchasePriceListItemDto {
  id: number;
  productId: number;
  totalPrice: number;
  totalQuantity: number;
  purchasedDate: string;
}
