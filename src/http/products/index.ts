import { AxiosResponse } from "axios";
import { baseAxiosInstance } from "..";
import DynamicQuery from "../../models/dynamicQuery";
import GetListResponse from "../../models/getListResponse";
import PageRequest from "../../models/pageRequest";
import CreateProductCommand from "./models/commands/createProductCommand";
import DeleteProductCommand from "./models/commands/deleteProductCommand";
import UpdateProductCommand from "./models/commands/updateProductCommand";
import CreatedProductResponse from "./models/responses/createdProductResponse";
import DeletedProductResponse from "./models/responses/deletedProductResponse";
import GetByIdProductResponse from "./models/responses/getByIdProductResponse";
import GetListByDynamicProductListItemDto from "./models/responses/getListByDynamicProductListItemDto";
import GetListProductListItemDto from "./models/responses/getListProductListItemDto";
import UpdatedProductResponse from "./models/responses/updatedProductResponse";

const instance = baseAxiosInstance;

export default {
  create: (createProductCommand: CreateProductCommand): Promise<AxiosResponse<CreatedProductResponse>> =>
    instance({
      method: "POST",
      url: "Products",
      data: createProductCommand,
    }),
  delete: (deleteProductCommand: DeleteProductCommand): Promise<AxiosResponse<DeletedProductResponse>> =>
    instance({
      method: "DELETE",
      url: "Products",
      data: deleteProductCommand,
    }),
  update: (updateProductCommand: UpdateProductCommand): Promise<AxiosResponse<UpdatedProductResponse>> =>
    instance({
      method: "PUT",
      url: "Products",
      data: updateProductCommand,
    }),
  getById: (id: number): Promise<AxiosResponse<GetByIdProductResponse>> =>
    instance({
      method: "GET",
      url: "Products" + id,
    }),
  getList: (pageRequest?: PageRequest): Promise<AxiosResponse<GetListResponse<GetListProductListItemDto>>> =>
    instance({
      method: "GET",
      url: "Products",
      params: pageRequest,
    }),
  getListByDynamic: (
    dynamicQuery: DynamicQuery,
    pageRequest?: PageRequest
  ): Promise<AxiosResponse<GetListResponse<GetListByDynamicProductListItemDto>>> =>
    instance({
      method: "POST",
      url: "Products/GetListByDynamic",
      data: dynamicQuery,
      params: pageRequest,
    }),
};
