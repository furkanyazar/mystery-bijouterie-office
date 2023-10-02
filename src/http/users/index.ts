import { AxiosResponse } from "axios";
import { baseAxiosInstance } from "..";
import { setUser } from "../../store/slices/userSlice";
import { store } from "../../store/store";
import GetByIdUserResponse from "./models/responses/getByIdUserResponse";

const instance = baseAxiosInstance;

export default {
  getFromAuth: (): Promise<AxiosResponse<GetByIdUserResponse>> =>
    instance({
      method: "GET",
      url: "Users/",
    }).then((response: AxiosResponse<GetByIdUserResponse>) => {
      store.dispatch(setUser(response.data));
      return response;
    }),
};
