import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
import { setUser } from "../../store/slices/userSlice";
import { store } from "../../store/store";
import GetByIdUserResponse from "./models/queries/getByIdUserResponse";

const instance = baseAxiosInstance;

const getUserFromAuth = async (): Promise<AxiosResponse<GetByIdUserResponse>> =>
  await instance({
    method: "GET",
    url: "Users/GetFromAuth",
  }).then((response: AxiosResponse<GetByIdUserResponse>) => {
    store.dispatch(setUser(response.data));
    return response;
  });

export default { getUserFromAuth };
