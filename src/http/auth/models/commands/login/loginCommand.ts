export default interface LoginCommand {
  email: string;
  password: string;
  authenticatorCode?: string;
}
