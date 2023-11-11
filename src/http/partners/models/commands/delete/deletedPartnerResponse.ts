export default interface DeletedPartnerResponse {
  id: number;
  name: string;
  shippingCost: number;
  hasFreeShipping: boolean;
  freeShippingLowerLimit: number;
  serviceFee: number;
}
