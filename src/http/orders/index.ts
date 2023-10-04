import { AxiosResponse } from "axios";
import { baseAxiosInstance } from "..";
import DynamicQuery from "../../models/dynamicQuery";
import GetListResponse from "../../models/getListResponse";
import PageRequest from "../../models/pageRequest";
import CreateOrderCommand from "./models/commands/createOrderCommand";
import DeleteOrderCommand from "./models/commands/deleteOrderCommand";
import UpdateOrderCommand from "./models/commands/updateOrderCommand";
import CreatedOrderResponse from "./models/responses/createdOrderResponse";
import DeletedOrderResponse from "./models/responses/deletedOrderResponse";
import GetByIdOrderResponse from "./models/responses/getByIdOrderResponse";
import GetListByDynamicOrderListItemDto from "./models/responses/getListByDynamicOrderListItemDto";
import GetListOrderListItemDto from "./models/responses/getListOrderListItemDto";
import UpdatedOrderResponse from "./models/responses/updatedOrderResponse";

const instance = baseAxiosInstance;

export default {
  create: (createOrderCommand: CreateOrderCommand): Promise<AxiosResponse<CreatedOrderResponse>> =>
    instance({
      method: "POST",
      url: "Orders",
      data: createOrderCommand,
    }),
  delete: (deleteOrderCommand: DeleteOrderCommand): Promise<AxiosResponse<DeletedOrderResponse>> =>
    instance({
      method: "DELETE",
      url: "Orders",
      data: deleteOrderCommand,
    }),
  update: (updateOrderCommand: UpdateOrderCommand): Promise<AxiosResponse<UpdatedOrderResponse>> =>
    instance({
      method: "PUT",
      url: "Orders",
      data: updateOrderCommand,
    }),
  getById: (id: number): Promise<AxiosResponse<GetByIdOrderResponse>> =>
    instance({
      method: "GET",
      url: "Orders" + id,
    }),
  getList: (pageRequest?: PageRequest): Promise<AxiosResponse<GetListResponse<GetListOrderListItemDto>>> =>
    instance({
      method: "GET",
      url: "Orders",
      params: pageRequest,
    }),
  getListByDynamic: (
    dynamicQuery: DynamicQuery,
    pageRequest?: PageRequest
  ): Promise<AxiosResponse<GetListResponse<GetListByDynamicOrderListItemDto>>> =>
    instance({
      method: "POST",
      url: "Orders/GetListByDynamic",
      data: dynamicQuery,
      params: pageRequest,
    }),
};
