export default interface LoggedResponse {
  accessToken: AccessToken;
  requiredAuthenticatorType: 0 | 1 | 2;
}

interface AccessToken {
  token: string;
  expiration: string;
}
