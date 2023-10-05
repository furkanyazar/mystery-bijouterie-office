import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
import { removeCookie, setCookie } from "../../functions";
import LoginCommand from "./models/commands/loginCommand";
import LoggedResponse from "./models/responses/loggedResponse";
import RevokedTokenResponse from "./models/responses/revokedTokenResponse";

const instance = baseAxiosInstance;

const login = async (loginDto: LoginCommand): Promise<AxiosResponse<LoggedResponse>> =>
  await instance({
    method: "POST",
    url: "Auth",
    data: loginDto,
  }).then((response: AxiosResponse<LoggedResponse>) => {
    const resData = response.data;
    setCookie("token", resData.token, resData.expiration);
    return response;
  });

const revokeToken = async (refreshToken?: string): Promise<AxiosResponse<RevokedTokenResponse>> =>
  await instance({
    method: "PUT",
    url: "Auth",
    data: refreshToken,
  }).then((response: AxiosResponse<RevokedTokenResponse>) => {
    removeCookie("token");
    return response;
  });

export default { login, revokeToken };
