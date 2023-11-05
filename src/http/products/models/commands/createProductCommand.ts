export default interface CreateProductCommand {
  name: string;
  barcodeNumber?: string;
  unitPrice: number;
}
