import { AxiosResponse } from "axios";
import { baseAxiosInstance } from "..";
import DynamicQuery from "../../models/dynamicQuery";
import GetListResponse from "../../models/getListResponse";
import PageRequest from "../../models/pageRequest";
import CreateExpenseCommand from "./models/commands/createExpenseCommand";
import DeleteExpenseCommand from "./models/commands/deleteExpenseCommand";
import UpdateExpenseCommand from "./models/commands/updateExpenseCommand";
import CreatedExpenseResponse from "./models/responses/createdExpenseResponse";
import DeletedExpenseResponse from "./models/responses/deletedExpenseResponse";
import GetByIdExpenseResponse from "./models/responses/getByIdExpenseResponse";
import GetListByDynamicExpenseListItemDto from "./models/responses/getListByDynamicExpenseListItemDto";
import GetListExpenseListItemDto from "./models/responses/getListExpenseListItemDto";
import UpdatedExpenseResponse from "./models/responses/updatedExpenseResponse";

const instance = baseAxiosInstance;

export default {
  create: (createExpenseCommand: CreateExpenseCommand): Promise<AxiosResponse<CreatedExpenseResponse>> =>
    instance({
      method: "POST",
      url: "Expenses",
      data: createExpenseCommand,
    }),
  delete: (deleteExpenseCommand: DeleteExpenseCommand): Promise<AxiosResponse<DeletedExpenseResponse>> =>
    instance({
      method: "DELETE",
      url: "Expenses",
      data: deleteExpenseCommand,
    }),
  update: (updateExpenseCommand: UpdateExpenseCommand): Promise<AxiosResponse<UpdatedExpenseResponse>> =>
    instance({
      method: "PUT",
      url: "Expenses",
      data: updateExpenseCommand,
    }),
  getById: (id: number): Promise<AxiosResponse<GetByIdExpenseResponse>> =>
    instance({
      method: "GET",
      url: "Expenses" + id,
    }),
  getList: (pageRequest?: PageRequest): Promise<AxiosResponse<GetListResponse<GetListExpenseListItemDto>>> =>
    instance({
      method: "GET",
      url: "Expenses",
      params: pageRequest,
    }),
  getListByDynamic: (
    dynamicQuery: DynamicQuery,
    pageRequest?: PageRequest
  ): Promise<AxiosResponse<GetListResponse<GetListByDynamicExpenseListItemDto>>> =>
    instance({
      method: "POST",
      url: "Expenses/GetListByDynamic",
      data: dynamicQuery,
      params: pageRequest,
    }),
};
