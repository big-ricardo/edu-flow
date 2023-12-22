export default interface IResponse<T> {
  status: number;
  message: string;
  error: string;
  data: T;
}
