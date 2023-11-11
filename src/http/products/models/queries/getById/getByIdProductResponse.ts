import GetByIdProductResponseCategoryCategoryPartnerListItemDto from "./getByIdProductResponseCategoryCategoryPartnerListItemDto";

export default interface GetByIdProductResponse {
  id: number;
  categoryId?: number;
  name: string;
  barcodeNumber: string;
  unitPrice: number;
  categoryName?: string;
  modelNumber: string;
  description?: string;
  imageUrl?: string;
  categoryCategoryPartners: GetByIdProductResponseCategoryCategoryPartnerListItemDto[];
}
