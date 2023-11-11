export default interface CreatePartnerCommand {
  name: string;
  shippingCost: number;
  hasFreeShipping: boolean;
  freeShippingLowerLimit: number;
  serviceFee: number;
}
