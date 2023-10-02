import GetByIdUserResponse from "../../http/users/models/responses/getByIdUserResponse";

export const userItems: IUserItems = {
  user: null,
};

export interface IUserItems {
  user?: GetByIdUserResponse;
}
