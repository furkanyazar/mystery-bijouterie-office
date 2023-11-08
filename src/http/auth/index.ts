import { AxiosResponse } from "axios";
import baseAxiosInstance from "..";
import { removeCookie, setCookie } from "../../functions";
import LoginCommand from "./models/commands/login/loginCommand";
import LoggedResponse from "./models/commands/login/loggedResponse";
import RevokedTokenResponse from "./models/commands/revokeToken/revokedTokenResponse";

const instance = baseAxiosInstance;

const login = async (loginDto: LoginCommand): Promise<AxiosResponse<LoggedResponse>> =>
  await instance({
    method: "POST",
    url: "Auth/Login",
    data: loginDto,
  }).then((response: AxiosResponse<LoggedResponse>) => {
    const resData = response.data;
    setCookie("token", resData.accessToken.token, resData.accessToken.expiration);
    return response;
  });

const revokeToken = async (): Promise<AxiosResponse<RevokedTokenResponse>> =>
  await instance({
    method: "PUT",
    url: "Auth/RevokeToken",
  }).then((response: AxiosResponse<RevokedTokenResponse>) => {
    removeCookie("token");
    return response;
  });

export default { login, revokeToken };
