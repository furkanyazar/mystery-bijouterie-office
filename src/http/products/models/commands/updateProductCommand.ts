export default interface UpdateProductCommand {
  id: number;
  categoryId: string;
  name: string;
  barcodeNumber: string;
  unitPrice: number;
  modelNumber: string;
}
