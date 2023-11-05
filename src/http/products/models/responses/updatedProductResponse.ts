export default interface UpdatedProductResponse {
  id: number;
  categoryId: number;
  name: string;
  barcodeNumber?: string;
  unitPrice: number;
  categoryName: string;
}
