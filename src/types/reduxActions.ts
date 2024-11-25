import { UsermetaProfileUpdate } from "@/features/auth/types/usermetaReducerType";

export type ReduxError = {
  message: string;
}

export type ReduxAction = {
  type: null | string;
  payload: null | object | UsermetaProfileUpdate;
  error?: null | string;
}