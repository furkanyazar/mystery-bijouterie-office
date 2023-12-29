import GetListCategoryCategoryPartnerListItemDto from "./getListCategoryCategoryPartnerListItemDto";

export default interface GetListCategoryListItemDto {
  id: number;
  name: string;
  categoryPartners: GetListCategoryCategoryPartnerListItemDto[];
}
