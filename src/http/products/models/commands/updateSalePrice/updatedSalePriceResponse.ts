import UpdatedSalePriceResponseCategoryCategoryPartnerListItemDto from "./updatedSalePriceResponseCategoryCategoryPartnerListItemDto";

export default interface UpdatedSalePriceResponse {
  id: number;
  categoryId?: number;
  name: string;
  barcodeNumber: string;
  purchasePrice: number;
  salePrice: number;
  categoryName?: string;
  modelNumber: string;
  description?: string;
  imageUrl?: string;
  status: boolean;
  categoryCategoryPartners: UpdatedSalePriceResponseCategoryCategoryPartnerListItemDto[];
}
