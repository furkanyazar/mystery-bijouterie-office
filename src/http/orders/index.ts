import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
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

const createOrder = async (createOrderCommand: CreateOrderCommand): Promise<AxiosResponse<CreatedOrderResponse>> =>
  await instance({
    method: "POST",
    url: "Orders",
    data: createOrderCommand,
  });

const deleteOrder = async (deleteOrderCommand: DeleteOrderCommand): Promise<AxiosResponse<DeletedOrderResponse>> =>
  await instance({
    method: "DELETE",
    url: "Orders",
    data: deleteOrderCommand,
  });

const updateOrder = async (updateOrderCommand: UpdateOrderCommand): Promise<AxiosResponse<UpdatedOrderResponse>> =>
  await instance({
    method: "PUT",
    url: "Orders",
    data: updateOrderCommand,
  });

const getByIdOrder = async (id: number): Promise<AxiosResponse<GetByIdOrderResponse>> =>
  await instance({
    method: "GET",
    url: "Orders/" + id,
  });

const getListOrder = async (pageRequest?: PageRequest): Promise<AxiosResponse<GetListResponse<GetListOrderListItemDto>>> =>
  await instance({
    method: "GET",
    url: "Orders",
    params: pageRequest,
  });

const getListByDynamicOrder = async (
  dynamicQuery: DynamicQuery,
  pageRequest?: PageRequest
): Promise<AxiosResponse<GetListResponse<GetListByDynamicOrderListItemDto>>> =>
  await instance({
    method: "POST",
    url: "Orders/GetListByDynamic",
    data: dynamicQuery,
    params: pageRequest,
  });

export default { createOrder, deleteOrder, updateOrder, getByIdOrder, getListOrder, getListByDynamicOrder };
