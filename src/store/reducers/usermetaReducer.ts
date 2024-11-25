import { UsermetaReducerType } from "@/features/auth/types/usermetaReducerType";
import { ReduxAction } from "@/types/reduxActions";
import { Reducer } from "redux";

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
	stripe_account_id: null,
  stripe_customer_id: null,
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
  is_deleted: false,
  is_pause: false
};

const usermetaReducer: Reducer<UsermetaReducerType, ReduxAction> = (state = initialState, action: ReduxAction) => {
  switch (action.type) {
    case 'usermeta/add':
      return {
        ...state,
        ...action.payload,
        error: null,
      };
    case 'usermeta/update':
      return {
        ...state,
        ...action.payload,
        error: null,
      };

    case 'usermeta/clear':
      return {
        ...state,
        ...initialState,
      };

    case 'usermeta/error':
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};

export default usermetaReducer;