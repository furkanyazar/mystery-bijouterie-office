import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
import DynamicQuery from "../../models/dynamicQuery";
import GetListResponse from "../../models/getListResponse";
import PageRequest from "../../models/pageRequest";
import CreatePartnerCommand from "./models/commands/createPartnerCommand";
import DeletePartnerCommand from "./models/commands/deletePartnerCommand";
import UpdatePartnerCommand from "./models/commands/updatePartnerCommand";
import CreatedPartnerResponse from "./models/responses/createdPartnerResponse";
import DeletedPartnerResponse from "./models/responses/deletedPartnerResponse";
import GetByIdPartnerResponse from "./models/responses/getByIdPartnerResponse";
import GetListByDynamicPartnerListItemDto from "./models/responses/getListByDynamicPartnerListItemDto";
import GetListPartnerListItemDto from "./models/responses/getListPartnerListItemDto";
import UpdatedPartnerResponse from "./models/responses/updatedPartnerResponse";

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

const getByIdPartner = async (id: number): Promise<AxiosResponse<GetByIdPartnerResponse>> =>
  await instance({
    method: "GET",
    url: "Partners/" + id,
  });

const getListPartner = async (pageRequest?: PageRequest): Promise<AxiosResponse<GetListResponse<GetListPartnerListItemDto>>> =>
  await instance({
    method: "GET",
    url: "Partners",
    params: pageRequest,
  });

const getListByDynamicPartner = async (
  dynamicQuery: DynamicQuery,
  pageRequest?: PageRequest
): Promise<AxiosResponse<GetListResponse<GetListByDynamicPartnerListItemDto>>> =>
  await instance({
    method: "POST",
    url: "Partners/GetListByDynamic",
    data: dynamicQuery,
    params: pageRequest,
  });

export default {
  createPartner,
  deletePartner,
  updatePartner,
  getByIdPartner,
  getListPartner,
  getListByDynamicPartner,
};
