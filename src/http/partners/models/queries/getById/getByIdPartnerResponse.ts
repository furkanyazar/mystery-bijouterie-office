export default interface GetByIdPartnerResponse {
  id: number;
  name: string;
  shippingCost: number;
  hasFreeShipping: boolean;
  freeShippingLowerLimit: number;
}
