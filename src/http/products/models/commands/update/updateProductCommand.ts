export default interface UpdateProductCommand {
  id: number;
  categoryId?: number;
  name: string;
  barcodeNumber: string;
  unitPrice: number;
  modelNumber: string;
  description?: string;
}
