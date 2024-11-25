export type AuthReducerType = {
  uid?: null | string;
  email: null | string;
  access_token: null | string;
  refresh_token: null | string;
  expires_at: null | number;
  expires_in: null | number;
  error?: null | string;
}