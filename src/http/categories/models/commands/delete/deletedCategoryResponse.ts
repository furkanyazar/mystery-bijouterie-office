import DeletedCategoryResponseCategoryPartnerListItemDto from "./deletedCategoryResponseCategoryPartnerListItemDto";

export default interface DeletedCategoryResponse {
  id: number;
  name: string;
  categoryPartners: DeletedCategoryResponseCategoryPartnerListItemDto[];
}
