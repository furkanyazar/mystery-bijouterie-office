import GetListByDynamicProductCategoryCategoryPartnerListItemDto from "./getListByDynamicProductCategoryCategoryPartnerListItemDto";
import GetListByDynamicProductProductMaterialListItemDto from "./getListByDynamicProductProductMaterialListItemDto";

export default interface GetListByDynamicProductListItemDto {
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
  categoryCategoryPartners: GetListByDynamicProductCategoryCategoryPartnerListItemDto[];
  productMaterials: GetListByDynamicProductProductMaterialListItemDto[];
  stockCode: string;
}
