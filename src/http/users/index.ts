import axios, { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
import { setUser } from "../../store/slices/userSlice";
import { store } from "../../store/store";
import GetByIdUserResponse from "./models/responses/getByIdUserResponse";

const instance = baseAxiosInstance;
const usersCancelToken = axios.CancelToken.source();

const getUserFromAuth = async (): Promise<AxiosResponse<GetByIdUserResponse>> =>
  await instance({
    method: "GET",
    url: "Users",
    cancelToken: usersCancelToken.token,
  }).then((response: AxiosResponse<GetByIdUserResponse>) => {
    store.dispatch(setUser(response.data));
    return response;
  });

export default { getUserFromAuth, usersCancelToken };
