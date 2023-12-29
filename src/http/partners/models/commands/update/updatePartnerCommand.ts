export default interface UpdatePartnerCommand {
  id: number;
  name: string;
  shippingCost: number;
  serviceFee: number;
  hasShippingScale: boolean;
  firstScaleLowerLimit?: number;
  firstScaleUpperLimit?: number;
  secondScaleLowerLimit?: number;
  secondScaleUpperLimit?: number;
  firstScaleShippingFee?: number;
  secondScaleShippingFee?: number;
  transactionFee: number;
  hasTaxShippingCost: boolean;
  hasTaxServiceFee: boolean;
  hasTaxTransactionFee: boolean;
  hasTaxCommissions: boolean;
}
