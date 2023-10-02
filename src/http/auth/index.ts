import { AxiosResponse } from "axios";
import { baseAxiosInstance } from "..";
import { removeCookie, setCookie } from "../../functions";
import LoginCommand from "./models/commands/loginCommand";
import LoggedResponse from "./models/responses/loggedResponse";
import RevokedTokenResponse from "./models/responses/revokedTokenResponse";

const instance = baseAxiosInstance;

export default {
  login: (loginDto: LoginCommand): Promise<AxiosResponse<LoggedResponse>> =>
    instance({
      method: "POST",
      url: "Auth/",
      data: loginDto,
    }).then((response: AxiosResponse<LoggedResponse>) => {
      const resData = response.data;
      setCookie("token", resData.token, resData.expiration);
      return response;
    }),
  revokeToken: (refreshToken?: string): Promise<AxiosResponse<RevokedTokenResponse>> =>
    instance({
      method: "PUT",
      url: "Auth/",
      data: refreshToken,
    }).then((response: AxiosResponse<RevokedTokenResponse>) => {
      removeCookie("token");
      return response;
    }),
};
