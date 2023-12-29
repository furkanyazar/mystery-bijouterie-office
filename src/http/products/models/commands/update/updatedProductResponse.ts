import UpdatedProductResponseCategoryCategoryPartnerListItemDto from "./updatedProductResponseCategoryCategoryPartnerListItemDto";
import UpdatedProductResponseProductMaterialListItemDto from "./updatedProductResponseProductMaterialListItemDto";

export default interface UpdatedProductResponse {
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
  unitsInStock: number;
  categoryCategoryPartners: UpdatedProductResponseCategoryCategoryPartnerListItemDto[];
  productMaterials: UpdatedProductResponseProductMaterialListItemDto[];
  stockCode?: string;
}
