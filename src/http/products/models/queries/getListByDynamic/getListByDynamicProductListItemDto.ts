import GetListByDynamicProductCategoryCategoryPartnerListItemDto from "./getListByDynamicProductCategoryCategoryPartnerListItemDto";

export default interface GetListByDynamicProductListItemDto {
  id: number;
  categoryId?: number;
  name: string;
  barcodeNumber: string;
  unitPrice: number;
  categoryName?: string;
  modelNumber: string;
  categoryCategoryPartners: GetListByDynamicProductCategoryCategoryPartnerListItemDto[];
}
