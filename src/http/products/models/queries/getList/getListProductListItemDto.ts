import GetListProductCategoryCategoryPartnerListItemDto from "./getListProductCategoryCategoryPartnerListItemDto";
import GetListProductProductMaterialListItemDto from "./getListProductProductMaterialListItemDto";

export default interface GetListProductListItemDto {
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
  categoryCategoryPartners: GetListProductCategoryCategoryPartnerListItemDto[];
  productMaterials: GetListProductProductMaterialListItemDto[];
  stockCode?: string;
}
