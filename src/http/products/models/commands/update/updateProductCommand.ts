export default interface UpdateProductCommand {
  id: number;
  categoryId?: number;
  name: string;
  barcodeNumber: string;
  purchasePrice: number;
  modelNumber: string;
  description?: string;
  status: boolean;
}
