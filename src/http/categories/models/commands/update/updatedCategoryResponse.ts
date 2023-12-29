import UpdatedCategoryResponseCategoryPartnerListItemDto from "./updatedCategoryResponseCategoryPartnerListItemDto";

export default interface UpdatedCategoryResponse {
  id: number;
  name: string;
  categoryPartners: UpdatedCategoryResponseCategoryPartnerListItemDto[];
}
