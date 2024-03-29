import GetByIdProductResponseCategoryCategoryPartnerListItemDto from "./getByIdProductResponseCategoryCategoryPartnerListItemDto";
import GetByIdProductResponseProductMaterialListItemDto from "./getByIdProductResponseProductMaterialListItemDto";

export default interface GetByIdProductResponse {
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
  categoryCategoryPartners: GetByIdProductResponseCategoryCategoryPartnerListItemDto[];
  productMaterials: GetByIdProductResponseProductMaterialListItemDto[];
  stockCode?: string;
}
