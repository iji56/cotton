import { AuthReducerType } from '@/features/auth/types/authReducerType';
import { ReduxError } from '@/types/reduxActions';

export const authLogin = (payload: AuthReducerType) => {
  return { type: 'auth/login', payload };
};

export const authSignup = (payload: AuthReducerType) => {
  return { type: 'auth/signup', payload };
};

export const authLogout = () => {
  return { type: 'auth/logout' };
};

export const authError = (error: ReduxError) => {
  return { type: 'auth/error', error: error.message };
};
