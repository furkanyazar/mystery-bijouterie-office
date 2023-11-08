import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
import GetListResponse from "../../models/getListResponse";
import CreateProductCommand from "./models/commands/create/createProductCommand";
import CreatedProductResponse from "./models/commands/create/createdProductResponse";
import DeleteProductCommand from "./models/commands/delete/deleteProductCommand";
import DeletedProductResponse from "./models/commands/delete/deletedProductResponse";
import UpdateProductCommand from "./models/commands/update/updateProductCommand";
import UpdatedProductResponse from "./models/commands/update/updatedProductResponse";
import GetByIdProductQuery from "./models/queries/getById/getByIdProductQuery";
import GetByIdProductResponse from "./models/queries/getById/getByIdProductResponse";
import GetListProductListItemDto from "./models/queries/getList/getListProductListItemDto";
import GetListProductQuery from "./models/queries/getList/getListProductQuery";
import GetListByDynamicProductListItemDto from "./models/queries/getListByDynamic/getListByDynamicProductListItemDto";
import GetListByDynamicProductQuery from "./models/queries/getListByDynamic/getListByDynamicProductQuery";

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

const getByIdProduct = async (getByIdProductQuery: GetByIdProductQuery): Promise<AxiosResponse<GetByIdProductResponse>> =>
  await instance({
    method: "GET",
    url: "Products/" + getByIdProductQuery.id,
  });

const getListProduct = async (
  getListProductQuery?: GetListProductQuery
): Promise<AxiosResponse<GetListResponse<GetListProductListItemDto>>> =>
  await instance({
    method: "GET",
    url: "Products",
    params: getListProductQuery?.pageRequest,
  });

const getListByDynamicProduct = async (
  getListByDynamicProductQuery: GetListByDynamicProductQuery
): Promise<AxiosResponse<GetListResponse<GetListByDynamicProductListItemDto>>> =>
  await instance({
    method: "POST",
    url: "Products/GetListByDynamic",
    data: getListByDynamicProductQuery.dynamicQuery,
    params: getListByDynamicProductQuery.pageRequest,
  });

export default {
  createProduct,
  deleteProduct,
  updateProduct,
  getByIdProduct,
  getListProduct,
  getListByDynamicProduct,
};
