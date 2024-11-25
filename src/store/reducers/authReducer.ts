import { AuthReducerType } from '@/features/auth/types/authReducerType';
import { ReduxAction } from '@/types/reduxActions';

const initialState: AuthReducerType = {
  uid: '',
  email: '',
  access_token: '',
  refresh_token: '',
  expires_at: 0,
  expires_in: 0,
  error: null,
};

const authReducer = (state = initialState, action: ReduxAction) => {
  switch (action.type) {
    case 'auth/login':
    case 'auth/signup':
      return {
        ...state,
        ...action.payload,
        error: null,
      };

    case 'auth/logout':
      return {
        ...state,
        ...initialState,
      };

    case 'auth/error':
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};

export default authReducer;
