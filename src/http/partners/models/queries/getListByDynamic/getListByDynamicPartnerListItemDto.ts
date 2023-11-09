export default interface GetListByDynamicPartnerListItemDto {
  id: number;
  name: string;
  shippingCost: number;
  hasFreeShipping: boolean;
  freeShippingLowerLimit: number;
}
