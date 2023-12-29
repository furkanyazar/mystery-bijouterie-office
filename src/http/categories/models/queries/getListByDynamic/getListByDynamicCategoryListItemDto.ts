import GetListByDynamicCategoryCategoryPartnerListItemDto from "./getListByDynamicCategoryCategoryPartnerListItemDto";

export default interface GetListByDynamicCategoryListItemDto {
  id: number;
  name: string;
  categoryPartners: GetListByDynamicCategoryCategoryPartnerListItemDto[];
}
