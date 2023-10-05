import axios, { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
import DynamicQuery from "../../models/dynamicQuery";
import GetListResponse from "../../models/getListResponse";
import PageRequest from "../../models/pageRequest";
import CreateByProductCommand from "./models/commands/createByProductCommand";
import DeleteByProductCommand from "./models/commands/deleteByProductCommand";
import UpdateByProductCommand from "./models/commands/updateByProductCommand";
import CreatedByProductResponse from "./models/responses/createdByProductResponse";
import DeletedByProductResponse from "./models/responses/deletedByProductResponse";
import GetByIdByProductResponse from "./models/responses/getByIdByProductResponse";
import GetListByDynamicByProductListItemDto from "./models/responses/getListByDynamicByProductListItemDto";
import GetListByProductListItemDto from "./models/responses/getListByProductListItemDto";
import UpdatedByProductResponse from "./models/responses/updatedByProductResponse";

const instance = baseAxiosInstance;
const byProductsCancelToken = axios.CancelToken.source();

const createByProduct = async (createByProductCommand: CreateByProductCommand): Promise<AxiosResponse<CreatedByProductResponse>> =>
  await instance({
    method: "POST",
    url: "ByProducts",
    data: createByProductCommand,
    cancelToken: byProductsCancelToken.token,
  });

const deleteByProduct = async (deleteByProductCommand: DeleteByProductCommand): Promise<AxiosResponse<DeletedByProductResponse>> =>
  await instance({
    method: "DELETE",
    url: "ByProducts",
    data: deleteByProductCommand,
    cancelToken: byProductsCancelToken.token,
  });

const updateByProduct = async (updateByProductCommand: UpdateByProductCommand): Promise<AxiosResponse<UpdatedByProductResponse>> =>
  await instance({
    method: "PUT",
    url: "ByProducts",
    data: updateByProductCommand,
    cancelToken: byProductsCancelToken.token,
  });

const getByIdByProduct = async (id: number): Promise<AxiosResponse<GetByIdByProductResponse>> =>
  await instance({
    method: "GET",
    url: "ByProducts/" + id,
    cancelToken: byProductsCancelToken.token,
  });

const getListByProduct = async (pageRequest?: PageRequest): Promise<AxiosResponse<GetListResponse<GetListByProductListItemDto>>> =>
  await instance({
    method: "GET",
    url: "ByProducts",
    params: pageRequest,
    cancelToken: byProductsCancelToken.token,
  });

const getListByDynamicByProduct = async (
  dynamicQuery: DynamicQuery,
  pageRequest?: PageRequest
): Promise<AxiosResponse<GetListResponse<GetListByDynamicByProductListItemDto>>> =>
  await instance({
    method: "POST",
    url: "ByProducts/GetListByDynamic",
    data: dynamicQuery,
    params: pageRequest,
    cancelToken: byProductsCancelToken.token,
  });

export default {
  createByProduct,
  deleteByProduct,
  updateByProduct,
  getByIdByProduct,
  getListByProduct,
  getListByDynamicByProduct,
  byProductsCancelToken,
};
