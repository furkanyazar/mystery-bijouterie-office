export default interface CreatedPartnerResponse {
  id: number;
  name: string;
  shippingCost: number;
  serviceFee: number;
  hasFirstScale: boolean;
  hasSecondScale: boolean;
  firstScaleLowerLimit?: number;
  firstScaleUpperLimit?: number;
  secondScaleLowerLimit?: number;
  secondScaleUpperLimit?: number;
  firstScaleShippingFee?: number;
  secondScaleShippingFee?: number;
}
