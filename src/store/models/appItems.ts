import GetListCategoryListItemDto from "../../http/categories/models/queries/getList/getListCategoryListItemDto";
import GetListDiscountListItemDto from "../../http/discounts/models/queries/getList/getListDiscountListItemDto";
import GetListMaterialListItemDto from "../../http/materials/models/queries/getList/getListMaterialListItemDto";
import GetListPartnerListItemDto from "../../http/partners/models/queries/getList/getListPartnerListItemDto";

export const appItems: IAppItems = {
  partners: [],
  categories: [],
  materials: [],
  discounts: [],
};

export interface IAppItems {
  partners: GetListPartnerListItemDto[];
  categories: GetListCategoryListItemDto[];
  materials: GetListMaterialListItemDto[];
  discounts: GetListDiscountListItemDto[];
}

export interface ISetListItem {
  listName: "partners" | "categories" | "materials" | "discounts";
  stateValue: any[];
}
