export default interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: any;
}
