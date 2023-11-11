import DeletedProductResponseCategoryCategoryPartnerListItemDto from "./deletedProductResponseCategoryCategoryPartnerListItemDto";

export default interface DeletedProductResponse {
  id: number;
  categoryId?: number;
  name: string;
  barcodeNumber: string;
  unitPrice: number;
  categoryName?: string;
  modelNumber: string;
  description?: string;
  imageUrl?: string;
  categoryCategoryPartners: DeletedProductResponseCategoryCategoryPartnerListItemDto[];
}
