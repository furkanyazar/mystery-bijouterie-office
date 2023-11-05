import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
import DynamicQuery from "../../models/dynamicQuery";
import GetListResponse from "../../models/getListResponse";
import PageRequest from "../../models/pageRequest";
import CreateCategoryCommand from "./models/commands/createCategoryCommand";
import DeleteCategoryCommand from "./models/commands/deleteCategoryCommand";
import UpdateCategoryCommand from "./models/commands/updateCategoryCommand";
import CreatedCategoryResponse from "./models/responses/createdCategoryResponse";
import DeletedCategoryResponse from "./models/responses/deletedCategoryResponse";
import GetByIdCategoryResponse from "./models/responses/getByIdCategoryResponse";
import GetListByDynamicCategoryListItemDto from "./models/responses/getListByDynamicCategoryListItemDto";
import GetListCategoryListItemDto from "./models/responses/getListCategoryListItemDto";
import UpdatedCategoryResponse from "./models/responses/updatedCategoryResponse";

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

const getByIdCategory = async (id: number): Promise<AxiosResponse<GetByIdCategoryResponse>> =>
  await instance({
    method: "GET",
    url: "Categories/" + id,
  });

const getListCategory = async (pageRequest?: PageRequest): Promise<AxiosResponse<GetListResponse<GetListCategoryListItemDto>>> =>
  await instance({
    method: "GET",
    url: "Categories",
    params: pageRequest,
  });

const getListByDynamicCategory = async (
  dynamicQuery: DynamicQuery,
  pageRequest?: PageRequest
): Promise<AxiosResponse<GetListResponse<GetListByDynamicCategoryListItemDto>>> =>
  await instance({
    method: "POST",
    url: "Categories/GetListByDynamic",
    data: dynamicQuery,
    params: pageRequest,
  });

export default {
  createCategory,
  deleteCategory,
  updateCategory,
  getByIdCategory,
  getListCategory,
  getListByDynamicCategory,
};
