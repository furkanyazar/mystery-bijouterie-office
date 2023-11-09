import GetListProductCategoryCategoryPartnerListItemDto from "./getListProductCategoryCategoryPartnerListItemDto";

export default interface GetListProductListItemDto {
  id: number;
  categoryId?: number;
  name: string;
  barcodeNumber: string;
  unitPrice: number;
  categoryName?: string;
  modelNumber: string;
  categoryCategoryPartners: GetListProductCategoryCategoryPartnerListItemDto[];
}
