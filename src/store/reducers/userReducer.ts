import { UsermetaReducerType } from '@/features/auth/types/usermetaReducer';
import { ReduxAction, } from '@/types/reduxActions';

const initialState: UsermetaReducerType = {
  id: null,
  email: null,
  user_name: null,
  first_name: null,
  last_name: null,
  street_address_line_1: null,
  street_address_line_2: null,
  city: null,
  state: null,
  postal_code: null,
  country: null,
  stripe_id: null,
  bio: null,
  gender: null,
  height: null,
  weight: null,
  body_type: null,
	onboarding_complete: null,
  account_paused: null,
  favourites: null,
  user_picture: null,
  error: null,
};

const userReducer = (state = initialState, action: ReduxAction) => {
  switch (action.type) {
    case 'user/add':
      return {
        ...state,
        ...action.payload,
        error: null,
      };

    case 'user/update':
      if (
        action.payload
        && 'userName' in action.payload
        && 'firstName' in action.payload
        && 'bio' in action.payload
      ) {
        return {
          ...state,
          userName: action.payload.userName ?? state.user_name,
          firstName: action.payload.firstName ?? state.first_name,
          bio: action.payload.bio ?? state.bio,
        };
      } else {
        return state;
      }

    case 'user/clear':
      return {
        ...state,
        ...initialState,
      };

    case 'user/error':
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};

export default userReducer;
