import { AxiosError } from "axios";

import IErrorModified from "../interfaces/IErrorModified";
import IErrorResponse from "../interfaces/IErrorResponse";


export const errorHandle = (e: any): IErrorModified => {
  const error = e as AxiosError<IErrorResponse>;
  let message: string[];
  if (error.response?.data?.messages?.length) {
    message = error.response.data.messages;
  } else {
    message = [error?.message];
  }
  if (error?.status !== 401) {
    // navigateTo("/error", { state: message });
  }
  return { message, status: error?.status };
};
