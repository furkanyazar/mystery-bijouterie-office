export default interface CreatedPartnerResponse {
  id: number;
  name: string;
  shippingCost: number;
  hasFreeShipping: boolean;
  freeShippingLowerLimit: number;
  serviceFee: number;
}
