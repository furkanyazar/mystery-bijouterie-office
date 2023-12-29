import GetByIdCategoryResponseCategoryPartnerListItemDto from "./getByIdCategoryResponseCategoryPartnerListItemDto";

export default interface GetByIdCategoryResponse {
  id: number;
  name: string;
  categoryPartners: GetByIdCategoryResponseCategoryPartnerListItemDto[];
}
