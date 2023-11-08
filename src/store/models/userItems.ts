import GetByIdUserResponse from "../../http/users/models/queries/getByIdUserResponse";

export const userItems: IUserItems = {
  user: null,
};

export interface IUserItems {
  user?: GetByIdUserResponse;
}
