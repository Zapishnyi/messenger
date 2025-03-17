import { AxiosRequestConfig, AxiosResponse } from 'axios';

export default interface IErrorNoResponse {
  message: string,
  name: string,
  code?: string;
  config: AxiosRequestConfig;
  request?: any;
  response?: AxiosResponse;

}