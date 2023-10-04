import { AxiosResponse } from "axios";
import { baseAxiosInstance } from "..";
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

export default {
  create: (createPurchasePriceCommand: CreatePurchasePriceCommand): Promise<AxiosResponse<CreatedPurchasePriceResponse>> =>
    instance({
      method: "POST",
      url: "PurchasePrices",
      data: createPurchasePriceCommand,
    }),
  delete: (deletePurchasePriceCommand: DeletePurchasePriceCommand): Promise<AxiosResponse<DeletedPurchasePriceResponse>> =>
    instance({
      method: "DELETE",
      url: "PurchasePrices",
      data: deletePurchasePriceCommand,
    }),
  update: (updatePurchasePriceCommand: UpdatePurchasePriceCommand): Promise<AxiosResponse<UpdatedPurchasePriceResponse>> =>
    instance({
      method: "PUT",
      url: "PurchasePrices",
      data: updatePurchasePriceCommand,
    }),
  getById: (id: number): Promise<AxiosResponse<GetByIdPurchasePriceResponse>> =>
    instance({
      method: "GET",
      url: "PurchasePrices" + id,
    }),
  getList: (pageRequest?: PageRequest): Promise<AxiosResponse<GetListResponse<GetListPurchasePriceListItemDto>>> =>
    instance({
      method: "GET",
      url: "PurchasePrices",
      params: pageRequest,
    }),
  getListByDynamic: (
    dynamicQuery: DynamicQuery,
    pageRequest?: PageRequest
  ): Promise<AxiosResponse<GetListResponse<GetListByDynamicPurchasePriceListItemDto>>> =>
    instance({
      method: "POST",
      url: "PurchasePrices/GetListByDynamic",
      data: dynamicQuery,
      params: pageRequest,
    }),
};
