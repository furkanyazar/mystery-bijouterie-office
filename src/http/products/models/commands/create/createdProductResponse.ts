import CreatedProductResponseCategoryCategoryPartnerListItemDto from "./createdProductResponseCategoryCategoryPartnerListItemDto";

export default interface CreatedProductResponse {
  id: number;
  categoryId?: number;
  name: string;
  barcodeNumber: string;
  unitPrice: number;
  categoryName?: string;
  modelNumber: string;
  categoryCategoryPartners: CreatedProductResponseCategoryCategoryPartnerListItemDto[];
}
