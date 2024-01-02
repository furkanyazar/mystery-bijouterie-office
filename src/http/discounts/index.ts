import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
import GetListResponse from "../../models/getListResponse";
import CreateDiscountCommand from "./models/commands/create/createDiscountCommand";
import CreatedDiscountResponse from "./models/commands/create/createdDiscountResponse";
import DeleteDiscountCommand from "./models/commands/delete/deleteDiscountCommand";
import DeletedDiscountResponse from "./models/commands/delete/deletedDiscountResponse";
import UpdateDiscountCommand from "./models/commands/update/updateDiscountCommand";
import UpdatedDiscountResponse from "./models/commands/update/updatedDiscountResponse";
import GetByIdDiscountQuery from "./models/queries/getById/getByIdDiscountQuery";
import GetByIdDiscountResponse from "./models/queries/getById/getByIdDiscountResponse";
import GetListDiscountListItemDto from "./models/queries/getList/getListDiscountListItemDto";
import GetListDiscountQuery from "./models/queries/getList/getListDiscountQuery";
import GetListByDynamicDiscountListItemDto from "./models/queries/getListByDynamic/getListByDynamicDiscountListItemDto";
import GetListByDynamicDiscountQuery from "./models/queries/getListByDynamic/getListByDynamicDiscountQuery";

const instance = baseAxiosInstance;

const createDiscount = async (createDiscountCommand: CreateDiscountCommand): Promise<AxiosResponse<CreatedDiscountResponse>> =>
  await instance({
    method: "POST",
    url: "Discounts",
    data: createDiscountCommand,
  });

const deleteDiscount = async (deleteDiscountCommand: DeleteDiscountCommand): Promise<AxiosResponse<DeletedDiscountResponse>> =>
  await instance({
    method: "DELETE",
    url: "Discounts",
    data: deleteDiscountCommand,
  });

const updateDiscount = async (updateDiscountCommand: UpdateDiscountCommand): Promise<AxiosResponse<UpdatedDiscountResponse>> =>
  await instance({
    method: "PUT",
    url: "Discounts",
    data: updateDiscountCommand,
  });

const getByIdDiscount = async (getByIdDiscountQuery: GetByIdDiscountQuery): Promise<AxiosResponse<GetByIdDiscountResponse>> =>
  await instance({
    method: "GET",
    url: "Discounts/" + getByIdDiscountQuery.id,
  });

const getListDiscount = async (
  getListDiscountQuery?: GetListDiscountQuery
): Promise<AxiosResponse<GetListResponse<GetListDiscountListItemDto>>> =>
  await instance({
    method: "GET",
    url: "Discounts",
    params: getListDiscountQuery?.pageRequest,
  });

const getListByDynamicDiscount = async (
  getListByDynamicDiscountQuery: GetListByDynamicDiscountQuery
): Promise<AxiosResponse<GetListResponse<GetListByDynamicDiscountListItemDto>>> =>
  await instance({
    method: "POST",
    url: "Discounts/GetListByDynamic",
    data: getListByDynamicDiscountQuery.dynamicQuery,
    params: getListByDynamicDiscountQuery.pageRequest,
  });

export default {
  createDiscount,
  deleteDiscount,
  updateDiscount,
  getByIdDiscount,
  getListDiscount,
  getListByDynamicDiscount,
};
