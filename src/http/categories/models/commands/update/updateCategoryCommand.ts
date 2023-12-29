import UpdateCategoryCommandCategoryPartnerListItemDto from "./updateCategoryCommandCategoryPartnerListItemDto";

export default interface UpdateCategoryCommand {
  id: number;
  name: string;
  categoryPartners: UpdateCategoryCommandCategoryPartnerListItemDto[];
}
