import { AxiosResponse } from "axios";
import { baseAxiosInstance } from "..";
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

export default {
  create: (createByProductCommand: CreateByProductCommand): Promise<AxiosResponse<CreatedByProductResponse>> =>
    instance({
      method: "POST",
      url: "ByProducts",
      data: createByProductCommand,
    }),
  delete: (deleteByProductCommand: DeleteByProductCommand): Promise<AxiosResponse<DeletedByProductResponse>> =>
    instance({
      method: "DELETE",
      url: "ByProducts",
      data: deleteByProductCommand,
    }),
  update: (updateByProductCommand: UpdateByProductCommand): Promise<AxiosResponse<UpdatedByProductResponse>> =>
    instance({
      method: "PUT",
      url: "ByProducts",
      data: updateByProductCommand,
    }),
  getById: (id: number): Promise<AxiosResponse<GetByIdByProductResponse>> =>
    instance({
      method: "GET",
      url: "ByProducts" + id,
    }),
  getList: (pageRequest?: PageRequest): Promise<AxiosResponse<GetListResponse<GetListByProductListItemDto>>> =>
    instance({
      method: "GET",
      url: "ByProducts",
      params: pageRequest,
    }),
  getListByDynamic: (
    dynamicQuery: DynamicQuery,
    pageRequest?: PageRequest
  ): Promise<AxiosResponse<GetListResponse<GetListByDynamicByProductListItemDto>>> =>
    instance({
      method: "POST",
      url: "ByProducts/GetListByDynamic",
      data: dynamicQuery,
      params: pageRequest,
    }),
};
