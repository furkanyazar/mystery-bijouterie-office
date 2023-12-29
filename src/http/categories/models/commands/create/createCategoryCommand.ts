import CreateCategoryCommandCategoryPartnerListItemDto from "./createCategoryCommandCategoryPartnerListItemDto";

export default interface CreateCategoryCommand {
  name: string;
  categoryPartners: CreateCategoryCommandCategoryPartnerListItemDto[];
}
