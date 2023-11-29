import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
import GetListResponse from "../../models/getListResponse";
import CreateMaterialCommand from "./models/commands/create/createMaterialCommand";
import CreatedMaterialResponse from "./models/commands/create/createdMaterialResponse";
import DeleteMaterialCommand from "./models/commands/delete/deleteMaterialCommand";
import DeletedMaterialResponse from "./models/commands/delete/deletedMaterialResponse";
import UpdateMaterialCommand from "./models/commands/update/updateMaterialCommand";
import UpdatedMaterialResponse from "./models/commands/update/updatedMaterialResponse";
import GetByIdMaterialQuery from "./models/queries/getById/getByIdMaterialQuery";
import GetByIdMaterialResponse from "./models/queries/getById/getByIdMaterialResponse";
import GetListMaterialListItemDto from "./models/queries/getList/getListMaterialListItemDto";
import GetListMaterialQuery from "./models/queries/getList/getListMaterialQuery";
import GetListByDynamicMaterialListItemDto from "./models/queries/getListByDynamic/getListByDynamicMaterialListItemDto";
import GetListByDynamicMaterialQuery from "./models/queries/getListByDynamic/getListByDynamicMaterialQuery";

const instance = baseAxiosInstance;

const createMaterial = async (createMaterialCommand: CreateMaterialCommand): Promise<AxiosResponse<CreatedMaterialResponse>> =>
  await instance({
    method: "POST",
    url: "Materials",
    data: createMaterialCommand,
  });

const deleteMaterial = async (deleteMaterialCommand: DeleteMaterialCommand): Promise<AxiosResponse<DeletedMaterialResponse>> =>
  await instance({
    method: "DELETE",
    url: "Materials",
    data: deleteMaterialCommand,
  });

const updateMaterial = async (updateMaterialCommand: UpdateMaterialCommand): Promise<AxiosResponse<UpdatedMaterialResponse>> =>
  await instance({
    method: "PUT",
    url: "Materials",
    data: updateMaterialCommand,
  });

const getByIdMaterial = async (getByIdMaterialQuery: GetByIdMaterialQuery): Promise<AxiosResponse<GetByIdMaterialResponse>> =>
  await instance({
    method: "GET",
    url: "Materials/" + getByIdMaterialQuery.id,
  });

const getListMaterial = async (
  getListMaterialQuery?: GetListMaterialQuery
): Promise<AxiosResponse<GetListResponse<GetListMaterialListItemDto>>> =>
  await instance({
    method: "GET",
    url: "Materials",
    params: getListMaterialQuery?.pageRequest,
  });

const getListByDynamicMaterial = async (
  getListByDynamicMaterialQuery: GetListByDynamicMaterialQuery
): Promise<AxiosResponse<GetListResponse<GetListByDynamicMaterialListItemDto>>> =>
  await instance({
    method: "POST",
    url: "Materials/GetListByDynamic",
    data: getListByDynamicMaterialQuery.dynamicQuery,
    params: getListByDynamicMaterialQuery.pageRequest,
  });

export default {
  createMaterial,
  deleteMaterial,
  updateMaterial,
  getByIdMaterial,
  getListMaterial,
  getListByDynamicMaterial,
};
