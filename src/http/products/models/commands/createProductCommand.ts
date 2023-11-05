export default interface CreateProductCommand {
  categoryId: number;
  name: string;
  barcodeNumber?: string;
  unitPrice: number;
}
