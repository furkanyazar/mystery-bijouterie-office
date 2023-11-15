export default interface CreateProductCommand {
  categoryId?: number;
  name: string;
  barcodeNumber: string;
  purchasePrice: number;
  modelNumber: string;
  description?: string;
  status: boolean;
}
