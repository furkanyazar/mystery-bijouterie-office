export default interface CreateDiscountCommand {
  partnerId: number;
  name: string;
  discountType: number;
  discountAmount: number;
  discountLowerLimit: number;
  priority: number;
}
