export default interface GetListProductListItemDto {
  id: number;
  categoryId: number;
  name: string;
  barcodeNumber?: string;
  unitPrice: number;
  categoryName: string;
}
