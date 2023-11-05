export default interface GetListByDynamicProductListItemDto {
  id: number;
  categoryId: number;
  name: string;
  barcodeNumber?: string;
  unitPrice: number;
  categoryName: string;
}
