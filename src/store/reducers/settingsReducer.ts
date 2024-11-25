import { SettingsReducerType } from '@/features/settings/types/settingsReducerType';
import { ReduxAction } from '@/types/reduxActions';
import { Reducer } from 'redux';

const initialState: SettingsReducerType = {
  id: null,
  user_id: null,
  pref_occasion: null,
  pref_fit: null,
  pref_city: null,
  pref_theme: null,
  pref_pickup: null,
  pref_hide_size: null,
  notif_follow: null,
  notif_like: null,
  notif_borrow: null,
  notif_lend: null,
  notif_chat: null,
  email_follow: null,
  email_like: null,
  email_borrow: null,
  email_lend: null,
  email_chat: null,
  error: null,
};

const settingsReducer: Reducer<SettingsReducerType, ReduxAction> = (state = initialState, action: ReduxAction) => {
  switch (action.type) {
    case 'settings/add':
    case 'settings/update':
      return {
        ...state,
        ...action.payload,
        error: null,
      };

    case 'settings/clear':
      return {
        ...state,
        ...initialState,
      };

    case 'settings/error':
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};

export default settingsReducer;