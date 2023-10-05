import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
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

const createExpense = async (createExpenseCommand: CreateExpenseCommand): Promise<AxiosResponse<CreatedExpenseResponse>> =>
  await instance({
    method: "POST",
    url: "Expenses",
    data: createExpenseCommand,
  });

const deleteExpense = async (deleteExpenseCommand: DeleteExpenseCommand): Promise<AxiosResponse<DeletedExpenseResponse>> =>
  await instance({
    method: "DELETE",
    url: "Expenses",
    data: deleteExpenseCommand,
  });

const updateExpense = async (updateExpenseCommand: UpdateExpenseCommand): Promise<AxiosResponse<UpdatedExpenseResponse>> =>
  await instance({
    method: "PUT",
    url: "Expenses",
    data: updateExpenseCommand,
  });

const getByIdExpense = async (id: number): Promise<AxiosResponse<GetByIdExpenseResponse>> =>
  await instance({
    method: "GET",
    url: "Expenses/" + id,
  });

const getListExpense = async (pageRequest?: PageRequest): Promise<AxiosResponse<GetListResponse<GetListExpenseListItemDto>>> =>
  await instance({
    method: "GET",
    url: "Expenses",
    params: pageRequest,
  });

const getListByDynamicExpense = async (
  dynamicQuery: DynamicQuery,
  pageRequest?: PageRequest
): Promise<AxiosResponse<GetListResponse<GetListByDynamicExpenseListItemDto>>> =>
  await instance({
    method: "POST",
    url: "Expenses/GetListByDynamic",
    data: dynamicQuery,
    params: pageRequest,
  });

export default { createExpense, deleteExpense, updateExpense, getByIdExpense, getListExpense, getListByDynamicExpense };
