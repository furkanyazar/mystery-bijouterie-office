export default interface GetListPartnerListItemDto {
  id: number;
  name: string;
  shippingCost: number;
  hasFreeShipping: boolean;
  freeShippingLowerLimit: number;
}
