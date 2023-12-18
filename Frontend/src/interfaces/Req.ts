export default interface Req<T> {
  status: number;
  message: string;
  error: string;
  data: T;
}
