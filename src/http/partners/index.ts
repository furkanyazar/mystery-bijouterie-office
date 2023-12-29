import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
import GetListResponse from "../../models/getListResponse";
import CreatePartnerCommand from "./models/commands/create/createPartnerCommand";
import CreatedPartnerResponse from "./models/commands/create/createdPartnerResponse";
import DeletePartnerCommand from "./models/commands/delete/deletePartnerCommand";
import DeletedPartnerResponse from "./models/commands/delete/deletedPartnerResponse";
import UpdatePartnerCommand from "./models/commands/update/updatePartnerCommand";
import UpdatedPartnerResponse from "./models/commands/update/updatedPartnerResponse";
import GetByIdPartnerQuery from "./models/queries/getById/getByIdPartnerQuery";
import GetByIdPartnerResponse from "./models/queries/getById/getByIdPartnerResponse";
import GetListPartnerListItemDto from "./models/queries/getList/getListPartnerListItemDto";
import GetListPartnerQuery from "./models/queries/getList/getListPartnerQuery";
import GetListByDynamicPartnerListItemDto from "./models/queries/getListByDynamic/getListByDynamicPartnerListItemDto";
import GetListByDynamicPartnerQuery from "./models/queries/getListByDynamic/getListByDynamicPartnerQuery";

const instance = baseAxiosInstance;

const createPartner = async (createPartnerCommand: CreatePartnerCommand): Promise<AxiosResponse<CreatedPartnerResponse>> =>
  await instance({
    method: "POST",
    url: "Partners",
    data: createPartnerCommand,
  });

const deletePartner = async (deletePartnerCommand: DeletePartnerCommand): Promise<AxiosResponse<DeletedPartnerResponse>> =>
  await instance({
    method: "DELETE",
    url: "Partners",
    data: deletePartnerCommand,
  });

const updatePartner = async (updatePartnerCommand: UpdatePartnerCommand): Promise<AxiosResponse<UpdatedPartnerResponse>> =>
  await instance({
    method: "PUT",
    url: "Partners",
    data: updatePartnerCommand,
  });

const getByIdPartner = async (getByIdPartnerQuery: GetByIdPartnerQuery): Promise<AxiosResponse<GetByIdPartnerResponse>> =>
  await instance({
    method: "GET",
    url: "Partners/" + getByIdPartnerQuery.id,
  });

const getListPartner = async (
  getListPartnerQuery?: GetListPartnerQuery
): Promise<AxiosResponse<GetListResponse<GetListPartnerListItemDto>>> =>
  await instance({
    method: "GET",
    url: "Partners",
    params: getListPartnerQuery?.pageRequest,
  });

const getListByDynamicPartner = async (
  getListByDynamicPartnerQuery: GetListByDynamicPartnerQuery
): Promise<AxiosResponse<GetListResponse<GetListByDynamicPartnerListItemDto>>> =>
  await instance({
    method: "POST",
    url: "Partners/GetListByDynamic",
    data: getListByDynamicPartnerQuery.dynamicQuery,
    params: getListByDynamicPartnerQuery.pageRequest,
  });

export default {
  createPartner,
  deletePartner,
  updatePartner,
  getByIdPartner,
  getListPartner,
  getListByDynamicPartner,
};
