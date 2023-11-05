export default interface UpdateProductCommand {
  id: number;
  name: string;
  barcodeNumber?: string;
  unitPrice: number;
}
