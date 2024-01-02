export default interface UpdateDiscountCommand {
  id: number;
  partnerId: number;
  name: string;
  discountType: number;
  discountAmount: number;
  discountLowerLimit: number;
  priority: number;
}
