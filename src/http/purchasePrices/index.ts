import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
import DynamicQuery from "../../models/dynamicQuery";
import GetListResponse from "../../models/getListResponse";
import PageRequest from "../../models/pageRequest";
import CreatePurchasePriceCommand from "./models/commands/createPurchasePriceCommand";
import DeletePurchasePriceCommand from "./models/commands/deletePurchasePriceCommand";
import UpdatePurchasePriceCommand from "./models/commands/updatePurchasePriceCommand";
import CreatedPurchasePriceResponse from "./models/responses/createdPurchasePriceResponse";
import DeletedPurchasePriceResponse from "./models/responses/deletedPurchasePriceResponse";
import GetByIdPurchasePriceResponse from "./models/responses/getByIdPurchasePriceResponse";
import GetListByDynamicPurchasePriceListItemDto from "./models/responses/getListByDynamicPurchasePriceListItemDto";
import GetListPurchasePriceListItemDto from "./models/responses/getListPurchasePriceListItemDto";
import UpdatedPurchasePriceResponse from "./models/responses/updatedPurchasePriceResponse";

const instance = baseAxiosInstance;

const createPurchasePrice = async (
  createPurchasePriceCommand: CreatePurchasePriceCommand
): Promise<AxiosResponse<CreatedPurchasePriceResponse>> =>
  await instance({
    method: "POST",
    url: "PurchasePrices",
    data: createPurchasePriceCommand,
  });

const deletePurchasePrice = async (
  deletePurchasePriceCommand: DeletePurchasePriceCommand
): Promise<AxiosResponse<DeletedPurchasePriceResponse>> =>
  await instance({
    method: "DELETE",
    url: "PurchasePrices",
    data: deletePurchasePriceCommand,
  });

const updatePurchasePrice = async (
  updatePurchasePriceCommand: UpdatePurchasePriceCommand
): Promise<AxiosResponse<UpdatedPurchasePriceResponse>> =>
  await instance({
    method: "PUT",
    url: "PurchasePrices",
    data: updatePurchasePriceCommand,
  });

const getByIdPurchasePrice = async (id: number): Promise<AxiosResponse<GetByIdPurchasePriceResponse>> =>
  await instance({
    method: "GET",
    url: "PurchasePrices/" + id,
  });

const getListPurchasePrice = async (pageRequest?: PageRequest): Promise<AxiosResponse<GetListResponse<GetListPurchasePriceListItemDto>>> =>
  await instance({
    method: "GET",
    url: "PurchasePrices",
    params: pageRequest,
  });

const getListByDynamicPurchasePrice = async (
  dynamicQuery: DynamicQuery,
  pageRequest?: PageRequest
): Promise<AxiosResponse<GetListResponse<GetListByDynamicPurchasePriceListItemDto>>> =>
  await instance({
    method: "POST",
    url: "PurchasePrices/GetListByDynamic",
    data: dynamicQuery,
    params: pageRequest,
  });

export default {
  createPurchasePrice,
  deletePurchasePrice,
  updatePurchasePrice,
  getByIdPurchasePrice,
  getListPurchasePrice,
  getListByDynamicPurchasePrice,
};
