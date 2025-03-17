export default interface IErrorResponse {
  status_code: number;
  messages: string[];
  timestamp: Date;
  path: string;
}