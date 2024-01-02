export default interface GetListByDynamicDiscountListItemDto {
  id: number;
  partnerId: number;
  name: string;
  discountType: number;
  discountAmount: number;
  partnerName: string;
  discountLowerLimit: number;
  priority: number;
}
