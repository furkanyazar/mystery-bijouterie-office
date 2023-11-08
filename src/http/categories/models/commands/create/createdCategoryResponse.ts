import CreatedCategoryResponseCategoryPartnerListItemDto from "./createdCategoryResponseCategoryPartnerListItemDto";

export default interface CreatedCategoryResponse {
  id: number;
  name: string;
  categoryPartners: CreatedCategoryResponseCategoryPartnerListItemDto[];
}
