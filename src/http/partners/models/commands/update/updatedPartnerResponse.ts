export default interface UpdatedPartnerResponse {
  id: number;
  name: string;
  shippingCost: number;
  hasFreeShipping: boolean;
  freeShippingLowerLimit: number;
}
