import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
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

const createProduct = async (createProductCommand: CreateProductCommand): Promise<AxiosResponse<CreatedProductResponse>> =>
  await instance({
    method: "POST",
    url: "Products",
    data: createProductCommand,
  });

const deleteProduct = async (deleteProductCommand: DeleteProductCommand): Promise<AxiosResponse<DeletedProductResponse>> =>
  await instance({
    method: "DELETE",
    url: "Products",
    data: deleteProductCommand,
  });

const updateProduct = async (updateProductCommand: UpdateProductCommand): Promise<AxiosResponse<UpdatedProductResponse>> =>
  await instance({
    method: "PUT",
    url: "Products",
    data: updateProductCommand,
  });

const getByIdProduct = async (id: number): Promise<AxiosResponse<GetByIdProductResponse>> =>
  await instance({
    method: "GET",
    url: "Products/" + id,
  });

const getListProduct = async (pageRequest?: PageRequest): Promise<AxiosResponse<GetListResponse<GetListProductListItemDto>>> =>
  await instance({
    method: "GET",
    url: "Products",
    params: pageRequest,
  });

const getListByDynamicProduct = async (
  dynamicQuery: DynamicQuery,
  pageRequest?: PageRequest
): Promise<AxiosResponse<GetListResponse<GetListByDynamicProductListItemDto>>> =>
  await instance({
    method: "POST",
    url: "Products/GetListByDynamic",
    data: dynamicQuery,
    params: pageRequest,
  });

export default {
  createProduct,
  deleteProduct,
  updateProduct,
  getByIdProduct,
  getListProduct,
  getListByDynamicProduct,
};
