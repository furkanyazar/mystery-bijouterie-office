import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
import GetListResponse from "../../models/getListResponse";
import CreateCategoryCommand from "./models/commands/create/createCategoryCommand";
import CreatedCategoryResponse from "./models/commands/create/createdCategoryResponse";
import DeleteCategoryCommand from "./models/commands/delete/deleteCategoryCommand";
import DeletedCategoryResponse from "./models/commands/delete/deletedCategoryResponse";
import UpdateCategoryCommand from "./models/commands/update/updateCategoryCommand";
import UpdatedCategoryResponse from "./models/commands/update/updatedCategoryResponse";
import GetByIdCategoryQuery from "./models/queries/getById/getByIdCategoryQuery";
import GetByIdCategoryResponse from "./models/queries/getById/getByIdCategoryResponse";
import GetListCategoryListItemDto from "./models/queries/getList/getListCategoryListItemDto";
import GetListCategoryQuery from "./models/queries/getList/getListCategoryQuery";
import GetListByDynamicCategoryListItemDto from "./models/queries/getListByDynamic/getListByDynamicCategoryListItemDto";
import GetListByDynamicCategoryQuery from "./models/queries/getListByDynamic/getListByDynamicCategoryQuery";

const instance = baseAxiosInstance;

const createCategory = async (createCategoryCommand: CreateCategoryCommand): Promise<AxiosResponse<CreatedCategoryResponse>> =>
  await instance({
    method: "POST",
    url: "Categories",
    data: createCategoryCommand,
  });

const deleteCategory = async (deleteCategoryCommand: DeleteCategoryCommand): Promise<AxiosResponse<DeletedCategoryResponse>> =>
  await instance({
    method: "DELETE",
    url: "Categories",
    data: deleteCategoryCommand,
  });

const updateCategory = async (updateCategoryCommand: UpdateCategoryCommand): Promise<AxiosResponse<UpdatedCategoryResponse>> =>
  await instance({
    method: "PUT",
    url: "Categories",
    data: updateCategoryCommand,
  });

const getByIdCategory = async (getByIdCategoryQuery: GetByIdCategoryQuery): Promise<AxiosResponse<GetByIdCategoryResponse>> =>
  await instance({
    method: "GET",
    url: "Categories/" + getByIdCategoryQuery.id,
  });

const getListCategory = async (
  getListCategoryQuery?: GetListCategoryQuery
): Promise<AxiosResponse<GetListResponse<GetListCategoryListItemDto>>> =>
  await instance({
    method: "GET",
    url: "Categories",
    params: getListCategoryQuery?.pageRequest,
  });

const getListByDynamicCategory = async (
  getListByDynamicCategoryQuery: GetListByDynamicCategoryQuery
): Promise<AxiosResponse<GetListResponse<GetListByDynamicCategoryListItemDto>>> =>
  await instance({
    method: "POST",
    url: "Categories/GetListByDynamic",
    data: getListByDynamicCategoryQuery.dynamicQuery,
    params: getListByDynamicCategoryQuery.pageRequest,
  });

export default {
  createCategory,
  deleteCategory,
  updateCategory,
  getByIdCategory,
  getListCategory,
  getListByDynamicCategory,
};
