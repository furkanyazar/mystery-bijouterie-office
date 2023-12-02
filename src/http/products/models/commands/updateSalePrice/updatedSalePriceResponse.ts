import UpdatedSalePriceResponseCategoryCategoryPartnerListItemDto from "./updatedSalePriceResponseCategoryCategoryPartnerListItemDto";
import UpdatedSalePriceResponseProductMaterialListItemDto from "./updatedSalePriceResponseProductMaterialListItemDto";

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
  productMaterials: UpdatedSalePriceResponseProductMaterialListItemDto[];
}
